import { useState, useMemo, useEffect, useRef } from 'react';
import styles from './ItemModal.module.css';
import ThreeModelViewer from '../shared/ThreeModelViewer';

// Procedural 3D Bowl Component using Three.js
function ThreeBowl({ imageUrl }) {
    const mountRef = useRef(null);

    useEffect(() => {
        if (!window.THREE) return;
        const THREE = window.THREE;
        
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 1.5, 3);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        mountRef.current.appendChild(renderer.domElement);

        // Lighting
        const ambient = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambient);
        const light = new THREE.PointLight(0xffffff, 0.8);
        light.position.set(2, 5, 2);
        scene.add(light);

        // 3D BOWL Group
        const bowlGroup = new THREE.Group();
        
        // 1. Ceramic Bowl (Cylinder with open top) - Smoother
        const bowlGeom = new THREE.CylinderGeometry(1, 0.65, 0.7, 64, 1, true);
        const bowlMat = new THREE.MeshPhongMaterial({ 
            color: 0xffffff, 
            side: THREE.DoubleSide,
            shininess: 100,
            specular: 0x444444
        });
        const bowl = new THREE.Mesh(bowlGeom, bowlMat);
        bowlGroup.add(bowl);

        // 2. Bowl Bottom (Solid base)
        const bottomGeom = new THREE.CircleGeometry(0.65, 64);
        const bottom = new THREE.Mesh(bottomGeom, bowlMat);
        bottom.rotation.x = -Math.PI / 2;
        bottom.position.y = -0.35;
        bowlGroup.add(bottom);

        // 3. Soup Surface (Raised up and textured)
        const textureLoader = new THREE.TextureLoader();
        textureLoader.crossOrigin = "anonymous";
        const soupTexture = textureLoader.load(imageUrl);
        const soupGeom = new THREE.CircleGeometry(0.96, 64);
        const soupMat = new THREE.MeshPhongMaterial({ 
            map: soupTexture,
            shininess: 10,
            transparent: true,
            opacity: 0.95
        });
        const soup = new THREE.Mesh(soupGeom, soupMat);
        soup.rotation.x = -Math.PI / 2;
        soup.position.y = 0.28; // Right near the top rim
        bowlGroup.add(soup);

        scene.add(bowlGroup);

        // Better Lights
        const sun = new THREE.DirectionalLight(0xffffff, 1);
        sun.position.set(5, 10, 5);
        scene.add(sun);
        
        const fill = new THREE.PointLight(0xf15a24, 0.5); // Orange reflection from the theme
        fill.position.set(-5, 2, -5);
        scene.add(fill);

        // Animation
        let frameId;
        const animate = () => {
            bowlGroup.rotation.y += 0.01;
            renderer.render(scene, camera);
            frameId = requestAnimationFrame(animate);
        };
        animate();

        // Cleanup
        return () => {
            cancelAnimationFrame(frameId);
            mountRef.current?.removeChild(renderer.domElement);
        };
    }, [imageUrl]);

    return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}

const INGREDIENT_ICONS = {
    'pomidor': 'fa-apple-whole', // close enough
    'xiyar': 'fa-leaf',
    'ət': 'fa-drumstick-bite',
    'toyuq': 'fa-feather',
    'pendir': 'fa-cheese',
    'soğan': 'fa-seedling',
    'çörək': 'fa-bread-slice',
    'sous': 'fa-bottle-droplet',
    'göbələk': 'fa-mushroom',
    'kartof': 'fa-circle',
    'bibər': 'fa-pepper-hot',
    'zeytun': 'fa-circle-dot',
    'yumurta': 'fa-egg',
    'balıq': 'fa-fish',
    'krevet': 'fa-shrimp',
    'limon': 'fa-lemon',
    'nanə': 'fa-leaf',
    'reyhan': 'fa-leaf',
    'qoz': 'fa-nut-brown',
    'mərci': 'fa-seedling',
};

export default function ItemModal({ item, onClose, onAdd }) {
    const [show3D, setShow3D] = useState(false);

    const ingredients = useMemo(() => {
        if (!item.desc) return [];
        const parts = item.desc.split(/[:;,.]/);
        return parts
            .map(p => p.trim())
            .filter(p => p.length > 2 && !p.toLowerCase().includes('tərkibi'))
            .map((name, i) => {
                const lower = name.toLowerCase();
                let icon = 'fa-circle';
                for (let key in INGREDIENT_ICONS) {
                    if (lower.includes(key)) {
                        icon = INGREDIENT_ICONS[key];
                        break;
                    }
                }
                // Random 3D positions for the explosion
                const angle = (i / parts.length) * Math.PI * 2;
                const dist = 140 + Math.random() * 60;
                return {
                    name,
                    icon,
                    x: Math.cos(angle) * dist,
                    y: Math.sin(angle) * dist,
                    z: 150 + Math.random() * 100,
                    delay: i * 0.1
                };
            });
    }, [item.desc]);

    return (
        <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
            <div className={styles.box}>
                <button className={styles.close} onClick={onClose}><i className="fa-solid fa-xmark" /></button>
                
                <div className={`${styles.imageSection} ${show3D ? styles.active3D : ''}`}>
                    <div className={styles.scene}>
                        {/* PHOTOREALISTIC 3D / AR MODE */}
                        {item.modelUrl && show3D ? (
                            <div className={styles.modelContainer}>
                                <ThreeModelViewer 
                                    key={item.modelUrl + "_v3"} 
                                    modelUrl={item.modelUrl} 
                                    yOffset={4.5}
                                    cameraZFactor={1.3}
                                />
                                <button className={styles.arBtn} onClick={() => alert('AR rejimi üçün model hazırlanır...')}>
                                    <i className="fa-solid fa-camera" /> Masanın üstündə gör
                                </button>
                            </div>
                        ) : show3D ? (
                            /* PROCEDURAL 3D BOWL (Three.js) */
                            <div className={styles.threeContainer}>
                                <ThreeBowl imageUrl={item.imgUrl} />
                            </div>
                        ) : (
                            /* LAYERED 2D PREVIEW */
                            <div className={styles.object3D}>
                                {/* Layered Extrusion: Creating thickness by stacking images */}
                                {[...Array(12)].map((_, i) => (
                                    <img 
                                        key={i}
                                        src={item.imgUrl} 
                                        alt="" 
                                        className={styles.imgLayer}
                                        style={{ '--layer': i }}
                                        onError={e => e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'} 
                                    />
                                ))}
                                
                                {/* Main Top Image */}
                                <img 
                                    src={item.imgUrl} 
                                    alt={item.name} 
                                    className={styles.imgMain}
                                    onError={e => e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'} 
                                />

                                {/* 3D Reflection/Glow */}
                                <div className={styles.imgGlow}></div>
                            </div>
                        )}
                        
                        {show3D && !item.modelUrl && ingredients.map((ing, idx) => (
                            <div 
                                key={idx}
                                className={styles.ingredient}
                                style={{
                                    '--tx': `${ing.x}px`,
                                    '--ty': `${ing.y}px`,
                                    '--tz': `${ing.z}px`,
                                    '--delay': `${ing.delay}s`
                                }}
                            >
                                <div className={styles.ingIcon}><i className={`fa-solid ${ing.icon}`} /></div>
                                <span className={styles.ingName}>{ing.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.body}>
                    <div className={styles.headerRow}>
                        {item.badge && <span className={styles.badge}>{item.badge}</span>}
                        {ingredients.length > 0 && (
                            <button 
                                className={`${styles.modeBtn} ${show3D ? styles.modeBtnActive : ''}`}
                                onClick={() => setShow3D(!show3D)}
                            >
                                <i className="fa-solid fa-cube" /> {show3D ? 'Geri Dön' : 'Tərkibi (3D)'}
                            </button>
                        )}
                    </div>
                    <h2 className={styles.name}>{item.name}</h2>
                    <p className={styles.desc}>{item.desc}</p>
                    <div className={styles.footer}>
                        <div className={styles.price}>{item.price.toFixed(2)} <span>₼</span></div>
                        <button className={styles.addBtn} onClick={() => { onAdd(item); onClose(); }}>
                            <i className="fa-solid fa-basket-shopping" /> Səbətə Əlavə Et
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
