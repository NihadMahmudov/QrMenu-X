import { useEffect, useRef, useState } from 'react';

// Helper to load external scripts
const loadScript = (src) => {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
};

export default function ThreeModelViewer({ modelUrl, height = '100%', yOffset = 0, cameraZFactor = 1.3 }) {
    const mountRef = useRef(null);
    const [scriptsLoaded, setScriptsLoaded] = useState(false);

    useEffect(() => {
        const loadAll = async () => {
            try {
                if (!window.THREE) {
                    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
                }
                if (!window.THREE.GLTFLoader) {
                    await loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js');
                }
                if (!window.THREE.OrbitControls) {
                    await loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js');
                }
                if (!window.MeshoptDecoder) {
                    await loadScript('https://unpkg.com/meshoptimizer@0.18.1/meshopt_decoder.js');
                    if (window.MeshoptDecoder) {
                        await window.MeshoptDecoder.ready;
                    }
                }
                setScriptsLoaded(true);
            } catch (err) {
                console.error("3D scripts load failed:", err);
            }
        };
        loadAll();
    }, []);

    useEffect(() => {
        if (!scriptsLoaded || !mountRef.current) return;
        
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
            
            model.position.x = -center.x;
            model.position.y = -center.y + yOffset; 
            model.position.z = -center.z;
            scene.add(model);
            
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = camera.fov * (Math.PI / 180);
            let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * cameraZFactor;
            
            camera.position.set(0, yOffset + (cameraZ * 0.5), cameraZ);
            controls.target.set(0, yOffset, 0); 
            controls.update();
        });

        let frameId;
        const animate = () => {
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
    }, [scriptsLoaded, modelUrl, yOffset, cameraZFactor]);

    return <div ref={mountRef} style={{ width: '100%', height, minHeight: '200px' }} />;
}
