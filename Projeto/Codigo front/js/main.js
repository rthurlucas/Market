 // --- 1. SETUP THREE.JS (Visual) ---
        const scene = new THREE.Scene();
        // Não usamos fog preto chapado, vamos deixar transparente pro degradê CSS aparecer
        
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.toneMapping = THREE.ACESFilmicToneMapping; // Cores mais realistas
        renderer.toneMappingExposure = 1.2;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Sombras suaves
        document.getElementById('canvas-container').appendChild(renderer.domElement);

        // --- ILUMINAÇÃO DE ESTÚDIO ---
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
        mainLight.position.set(5, 10, 7);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 1024;
        mainLight.shadow.mapSize.height = 1024;
        scene.add(mainLight);

        // Luz de Recorte (Rim Light) - Colorida
        const rimLight = new THREE.SpotLight(0xffffff, 5);
        rimLight.position.set(-5, 2, -2);
        rimLight.angle = Math.PI / 4;
        rimLight.penumbra = 0.5;
        scene.add(rimLight);

        // --- OBJETOS ---
        const productGroup = new THREE.Group();
        scene.add(productGroup);

        // 1. Corpo da Lata (Alumínio Escuro)
        const canGeometry = new THREE.CylinderGeometry(1, 1, 4, 64);
        // MeshPhysicalMaterial é melhor para metais
        const canMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x111111, 
            metalness: 0.9, 
            roughness: 0.3,
            clearcoat: 1.0, // Verniz por cima
            clearcoatRoughness: 0.1
        });
        const can = new THREE.Mesh(canGeometry, canMaterial);
        can.castShadow = true;
        can.receiveShadow = true;
        productGroup.add(can);

        // 2. Rótulo (Cor Brilhante)
        // Usamos physical material para o rótulo brilhar com a luz
        const labelMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0xffffff, // Será trocado dinamicamente
            metalness: 0.4,
            roughness: 0.2,
            clearcoat: 0.5,
            side: THREE.DoubleSide
        });
        // Um pouco maior que a lata para não "piscar" (z-fighting)
        const labelGeometry = new THREE.CylinderGeometry(1.01, 1.01, 2.6, 64, 1, true);
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        productGroup.add(label);

        // 3. Partículas (Fundo)
        const particlesGeometry = new THREE.BufferGeometry();
        const count = 500;
        const posArray = new Float32Array(count * 3);
        for(let i=0; i<count*3; i++) posArray[i] = (Math.random() - 0.5) * 20;
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({ size: 0.07, color: 0xffffff, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending });
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        productGroup.position.x = 2.5;
        camera.position.z = 7;

        // Loop de Animação
        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            const time = clock.getElapsedTime();
            
            // Flutuação mais complexa
            productGroup.position.y = Math.sin(time * 1.5) * 0.15;
            productGroup.rotation.y = time * 0.3; // Rotação constante
            productGroup.rotation.z = Math.sin(time * 0.5) * 0.05; // Leve inclinação lateral

            // Partículas se movem
            particlesMesh.rotation.y = -time * 0.05;
            particlesMesh.position.y = Math.sin(time * 0.2) * 0.5;

            renderer.render(scene, camera);
        }
        animate();


        // --- 2. LÓGICA FULL STACK ---
        
        let currentId = 1;
        let totalProdutos = 1;
        let isAnimating = false;

        async function init() {
            try {
                const resp = await fetch('http://localhost:8080/api/total');
                totalProdutos = await resp.json();
                carregarProduto(currentId);
            } catch (e) {
                console.log("Modo Offline (sem backend)", e);
                // Fallback manual se o Java não estiver rodando
                carregarProduto(1);
            }
        }

        async function carregarProduto(id) {
            try {
                const response = await fetch(`http://localhost:8080/api/produto/${id}`);
                const data = await response.json();
                
                // Texto UI
                document.getElementById('prod-nome').innerText = data.nome;
                document.getElementById('prod-preco').innerText = `R$ ${data.preco.toFixed(2)}`;
                document.getElementById('feedback').innerText = "";

                // A MÁGICA DA COR: Vem do Backend agora! (data.cor)
                const corHex = data.cor || "#00ff88"; // Fallback se o backend antigo não tiver cor
                const corObj = new THREE.Color(corHex);

                // 1. Atualiza CSS (Botões, Textos, Sombras)
                document.documentElement.style.setProperty('--primary-color', corHex);
                
                // 2. Fundo Degradê Dinâmico
                // Cria um gradiente radial suave com a cor do produto no fundo
                document.body.style.background = `radial-gradient(circle at 70% 50%, ${corHex}22 0%, #000000 70%)`;

                // 3. Atualiza 3D (GSAP para transição suave de cor)
                gsap.to(labelMaterial.color, { r: corObj.r, g: corObj.g, b: corObj.b, duration: 0.8 });
                gsap.to(rimLight.color, { r: corObj.r, g: corObj.g, b: corObj.b, duration: 0.8 });
                gsap.to(particlesMaterial.color, { r: corObj.r, g: corObj.g, b: corObj.b, duration: 0.8 });

            } catch (error) {
                console.error("Erro:", error);
            }
        }

        function trocarProduto(direcao) {
            if (isAnimating) return;
            isAnimating = true;

            if (direcao === 'next') {
                currentId = (currentId >= totalProdutos) ? 1 : currentId + 1;
            } else {
                currentId = (currentId <= 1) ? totalProdutos : currentId - 1;
            }

            // Animação de Saída e Entrada
            const tl = gsap.timeline({ onComplete: () => isAnimating = false });

            // Lata inclina e sai rápido
            tl.to(productGroup.position, { x: direcao === 'next' ? -8 : 8, rotationZ: direcao === 'next' ? 0.5 : -0.5, duration: 0.5, ease: "power2.in" })
              .to(productGroup.scale, { x: 0.8, y: 0.8, z: 0.8, duration: 0.5 }, "<"); // Diminui um pouco

            // Enquanto ela está fora, troca os dados
            tl.call(() => {
                carregarProduto(currentId);
                productGroup.position.x = direcao === 'next' ? 8 : -8; // Prepara entrada do outro lado
            });

            // Lata volta com impacto
            tl.to(productGroup.position, { x: 2.5, duration: 0.8, ease: "elastic.out(1, 0.6)" })
              .to(productGroup.rotation, { z: 0, duration: 0.8 }, "<")
              .to(productGroup.scale, { x: 1, y: 1, z: 1, duration: 0.8 }, "<");
        }

        document.getElementById('btn-next').addEventListener('click', () => trocarProduto('next'));
        document.getElementById('btn-prev').addEventListener('click', () => trocarProduto('prev'));

        document.getElementById('btn-comprar').addEventListener('click', async () => {
            const fb = document.getElementById('feedback');
            try {
                const res = await fetch(`http://localhost:8080/api/comprar/${currentId}`, { method: 'POST' });
                if (res.ok) {
                    fb.innerText = "COMPRA REALIZADA!";
                    fb.style.color = "var(--primary-color)";
                    // Lata gira 360 no eixo Y
                    gsap.to(productGroup.rotation, { y: productGroup.rotation.y + Math.PI * 2, duration: 1, ease: "back.out(1.7)" });
                } else {
                    fb.innerText = "ESTOQUE ESGOTADO!";
                    fb.style.color = "#ff3333";
                }
            } catch (e) { fb.innerText = "Erro no servidor."; }
        });

        // Responsividade
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        init();