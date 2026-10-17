const missionComm = {
    // 1. Datos del Centro de Control
    center: {
        name: "ESMC-Barcelona",
        key: "TERRA-042",
        buildSignature: () => `${missionComm.center.name}#${missionComm.center.key}`
    },

    // 2. Condiciones Ambientales Mutables
    env: {
        pressureKPa: 101.3,
        humidityPct: 45,
        setPressure: (kPa) => { missionComm.env.pressureKPa = Number(kPa); },
        setHumidity: (pct) => { missionComm.env.humidityPct = Number(pct); }
    },

    // 3. Módulo de Codificación
    codec: {
        normalize: (msg) => {
            // Usamos métodos de string y expresiones regulares, sin usar arrays
            return msg.trim().toUpperCase().replace(/\s+/g, ' ');
        },
        encode: (msg) => {
            const normalizedMsg = missionComm.codec.normalize(msg);
            return `[ENCODED]${normalizedMsg}|LEN=${normalizedMsg.length}`;
        },
        sign: (payload) => {
            return `${payload}|SIG=${missionComm.center.buildSignature()}`;
        }
    },

    // 4. Módulo de Radiofrecuencia (RF)
    rf: {
        calcFrequencyMHz: (pressureKPa, humidityPct) => {
            // Verificamos si los parámetros son válidos (números válidos y no vacíos)
            const p = (typeof pressureKPa === 'number' && !isNaN(pressureKPa)) 
                        ? pressureKPa 
                        : missionComm.env.pressureKPa;
                        
            const h = (typeof humidityPct === 'number' && !isNaN(humidityPct)) 
                        ? humidityPct 
                        : missionComm.env.humidityPct;

            // Fórmula: 100 + (H * 0.1) - (P * 0.05)
            return 100 + (h * 0.1) - (p * 0.05);
        },
        formatCarrier: (freq) => {
            return `${freq.toFixed(2)} MHz`;
        }
    }
};