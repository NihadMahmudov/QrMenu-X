import { useEffect, useRef } from 'react';

export default function ThreeModelViewer({ modelUrl, height = '100%', yOffset = 0, cameraZFactor = 1.3 }) {
    const mountRef = useRef(null);

    useEffect(() => {
        if (!window.THREE || !window.MeshoptDecoder) return;
        const THREE = window.THREE;
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.outputEncoding = THREE.sRGBEncoding;
        mountRef.current.appendChild(renderer.domElement);

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const width = entry.contentRect.width;
                const height = entry.contentRect.height;
                renderer.setSize(width, height);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
            }
        });
        resizeObserver.observe(mountRef.current);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 2.0;
        controls.enableZoom = false; 
        controls.enablePan = false;

        scene.add(new THREE.AmbientLight(0xffffff, 0.8));
        const spotLight = new THREE.SpotLight(0xffffff, 1.5);
        spotLight.position.set(5, 10, 5);
        scene.add(spotLight);

        // Particles
        const particlesGeometry = new THREE.BufferGeometry();
        const posArray = new Float32Array(100 * 3);
        for(let i=0; i < 300; i++) posArray[i] = (Math.random() - 0.5) * 10;
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMesh = new THREE.Points(particlesGeometry, new THREE.PointsMaterial({
            size: 0.02, color: '#fb923c', transparent: true, opacity: 0.5
        }));
        scene.add(particlesMesh);

        const loader = new THREE.GLTFLoader();
        if (window.MeshoptDecoder) loader.setMeshoptDecoder(window.MeshoptDecoder);

        loader.load(modelUrl, (gltf) => {
            const model = gltf.scene;
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            // Modeli, kameranı və hədəfi eyni yOffset səviyyəsinə qaldırırıq
            model.position.x = -center.x;
            model.position.y = -center.y + yOffset; 
            model.position.z = -center.z;
            scene.add(model);
            
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = camera.fov * (Math.PI / 180);
            let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * cameraZFactor;
            
            // Kamera həm modelin hündürlüyündədir, həm də bir az yuxarıdan baxır
            camera.position.set(0, yOffset + (cameraZ * 0.5), cameraZ);
            controls.target.set(0, yOffset, 0); 
            controls.update();
        });

        let frameId;
        const animate = () => {
            // Hədəfi hər kadrda yOffset-ə kilidləyirik
            controls.target.y = yOffset;
            controls.update();
            
            if (particlesMesh) particlesMesh.rotation.y += 0.001;
            renderer.render(scene, camera);
            frameId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            cancelAnimationFrame(frameId);
            resizeObserver.disconnect();
            if (mountRef.current) mountRef.current.innerHTML = '';
            controls.dispose();
        };
    }, [modelUrl, yOffset, cameraZFactor]);

    return <div ref={mountRef} style={{ width: '100%', height }} />;
}
