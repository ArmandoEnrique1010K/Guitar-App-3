
// EFECTO_PROPIEDAD_TIPO

// DISTORTION

// Distortion 
export const DISTORTION_DISTORTION_MIN = 0
export const DISTORTION_DISTORTION_MAX = 1
export const DISTORTION_DISTORTION_STEP = 0.01;
export const DISTORTION_DISTORTION_DEFAULT = 0.4
export const DISTORTION_DISTORTION_UNIT = "" // factor adimensional = sin unidad de medida

// Oversample  (opciones multiples)
export const DISTORTION_OVERSAMPLE_NONE = 'none'
export const DISTORTION_OVERSAMPLE_2X = '2x'
export const DISTORTION_OVERSAMPLE_4X = '4x'
export const DISTORTION_OVERSAMPLE_DEFAULT = DISTORTION_OVERSAMPLE_NONE
export const DISTORTION_OVERSAMPLE_UNIT = ""

// Wet (Mezcla)
export const DISTORTION_WET_MIN = 0;
export const DISTORTION_WET_MAX = 1;
export const DISTORTION_WET_STEP = 0.1;
export const DISTORTION_WET_DEFAULT = 0.5
export const DISTORTION_WET_UNIT = "%"


// REVERB

// Decay (decaimiento)
export const REVERB_DECAY_MIN = 0.1;
export const REVERB_DECAY_MAX = 10;
export const REVERB_DECAY_STEP = 0.1;
export const REVERB_DECAY_DEFAULT = 1.5
export const REVERB_DECAY_UNIT = "s"

// Predelay (pre-retardo)
export const REVERB_PREDELAY_MIN = 0; // Tiempo mínimo de pre-retardo
export const REVERB_PREDELAY_MAX = 0.1; // Tiempo máximo de pre-retardo
export const REVERB_PREDELAY_STEP = 0.001; // Incremento del pre-retardo
export const REVERB_PREDELAY_DEFAULT = 0.01
export const REVERB_PREDELAY_UNIT = "s"

// Wet (Mezcla)
export const REVERB_WET_MIN = 0;
export const REVERB_WET_MAX = 1;
export const REVERB_WET_STEP = 0.1;
export const REVERB_WET_DEFAULT = 0.5
export const REVERB_WET_UNIT = "%"

// VIBRATO

// Frequency (frecuencia)
export const VIBRATO_FREQUENCY_MIN = 0.1; // Frecuencia mínima en Hz
export const VIBRATO_FREQUENCY_MAX = 10; // Frecuencia máxima en Hz
export const VIBRATO_FREQUENCY_STEP = 0.1; // Incremento de frecuencia
export const VIBRATO_FREQUENCY_DEFAULT = 5; // Valor por defecto
export const VIBRATO_FREQUENCY_UNIT = "Hz"; // Unidad de medida

// Depth (profundidad)
export const VIBRATO_DEPTH_MIN = 0; // Profundidad mínima
export const VIBRATO_DEPTH_MAX = 1; // Profundidad máxima
export const VIBRATO_DEPTH_STEP = 0.01; // Incremento de profundidad
export const VIBRATO_DEPTH_DEFAULT = 0.1; // Valor por defecto
export const VIBRATO_DEPTH_UNIT = ""; // Adimensional

// Max Delay (retardo máximo)
export const VIBRATO_MAX_DELAY_MIN = 0.005; // Retardo mínimo en segundos
export const VIBRATO_MAX_DELAY_MAX = 0.1; // Retardo máximo en segundos
export const VIBRATO_MAX_DELAY_STEP = 0.001; // Incremento del retardo
export const VIBRATO_MAX_DELAY_DEFAULT = 0.005; // Valor por defecto
export const VIBRATO_MAX_DELAY_UNIT = "s"; // Unidad de medida

// Type (tipo) (opciones multiples)
export const VIBRATO_TYPE_SINE = 'sine'
export const VIBRATO_TYPE_SQUARE = 'square'
export const VIBRATO_TYPE_TRIANGLE = 'triangle'
export const VIBRATO_TYPE_SAWTOOTH = 'sawtooth'
export const VIBRATO_TYPE_DEFAULT = VIBRATO_TYPE_SINE
export const VIBRATO_TYPE_UNIT = ""

// Wet (mezcla)
export const VIBRATO_WET_MIN = 0; // Nivel mínimo de mezcla
export const VIBRATO_WET_MAX = 1; // Nivel máximo de mezcla
export const VIBRATO_WET_STEP = 0.1; // Incremento del nivel de mezcla
export const VIBRATO_WET_DEFAULT = 0.5; // Valor por defecto


// CHORUS

// Delay Time (tiempo de retardo)
export const CHORUS_DELAY_TIME_MIN = 0; // Tiempo mínimo de retardo en ms
export const CHORUS_DELAY_TIME_MAX = 20; // Tiempo máximo de retardo en ms
export const CHORUS_DELAY_TIME_STEP = 0.1; // Incremento del tiempo de retardo
export const CHORUS_DELAY_TIME_DEFAULT = 3.5; // Valor por defecto
export const CHORUS_DELAY_TIME_UNIT = "ms"; // Unidad de medida

// Depth (profundidad)
export const CHORUS_DEPTH_MIN = 0; // Profundidad mínima
export const CHORUS_DEPTH_MAX = 1; // Profundidad máxima
export const CHORUS_DEPTH_STEP = 0.01; // Incremento de profundidad
export const CHORUS_DEPTH_DEFAULT = 0.7; // Valor por defecto
export const CHORUS_DEPTH_UNIT = ""; // Adimensional

// Feedback (retroalimentación)
export const CHORUS_FEEDBACK_MIN = 0; // Retroalimentación mínima
export const CHORUS_FEEDBACK_MAX = 1; // Retroalimentación máxima
export const CHORUS_FEEDBACK_STEP = 0.01; // Incremento de retroalimentación
export const CHORUS_FEEDBACK_DEFAULT = 0.4; // Valor por defecto
export const CHORUS_FEEDBACK_UNIT = ""; // Adimensional

// Frequency (frecuencia)
export const CHORUS_FREQUENCY_MIN = 0.1; // Frecuencia mínima en Hz
export const CHORUS_FREQUENCY_MAX = 10; // Frecuencia máxima en Hz
export const CHORUS_FREQUENCY_STEP = 0.1; // Incremento de frecuencia
export const CHORUS_FREQUENCY_DEFAULT = 1.5; // Valor por defecto
export const CHORUS_FREQUENCY_UNIT = "Hz"; // Unidad de medida

// Spread (propagación estéreo)
export const CHORUS_SPREAD_MIN = 0; // Propagación mínima en grados
export const CHORUS_SPREAD_MAX = 360; // Propagación máxima en grados
export const CHORUS_SPREAD_STEP = 1; // Incremento de propagación
export const CHORUS_SPREAD_DEFAULT = 180; // Valor por defecto
export const CHORUS_SPREAD_UNIT = "°"; // Unidad de medida

// Wet (mezcla)
export const CHORUS_WET_MIN = 0; // Nivel mínimo de mezcla
export const CHORUS_WET_MAX = 1; // Nivel máximo de mezcla
export const CHORUS_WET_STEP = 0.1; // Incremento del nivel de mezcla
export const CHORUS_WET_DEFAULT = 1; // Valor por defecto
export const CHORUS_WET_UNIT = ""; // Adimensional

// Type (forma de onda)
export const CHORUS_TYPE_SINE = "sine";
export const CHORUS_TYPE_SQUARE = "square";
export const CHORUS_TYPE_TRIANGLE = "triangle";
export const CHORUS_TYPE_SAWTOOTH = "sawtooth";
export const CHORUS_TYPE_DEFAULT = CHORUS_TYPE_SINE; // Valor por defecto
export const CHORUS_TYPE_UNIT = ""; // Adimensional


// TREMOLO

// Frequency (frecuencia)
export const TREMOLO_FREQUENCY_MIN = 0.1; // Frecuencia mínima en Hz
export const TREMOLO_FREQUENCY_MAX = 20; // Frecuencia máxima en Hz
export const TREMOLO_FREQUENCY_STEP = 0.1; // Incremento de frecuencia
export const TREMOLO_FREQUENCY_DEFAULT = 5; // Valor por defecto
export const TREMOLO_FREQUENCY_UNIT = "Hz"; // Unidad de medida

// Depth (profundidad)
export const TREMOLO_DEPTH_MIN = 0; // Profundidad mínima
export const TREMOLO_DEPTH_MAX = 1; // Profundidad máxima
export const TREMOLO_DEPTH_STEP = 0.01; // Incremento de profundidad
export const TREMOLO_DEPTH_DEFAULT = 0.5; // Valor por defecto
export const TREMOLO_DEPTH_UNIT = ""; // Adimensional

// Spread (propagación estéreo)
export const TREMOLO_SPREAD_MIN = 0; // Propagación mínima en grados
export const TREMOLO_SPREAD_MAX = 360; // Propagación máxima en grados
export const TREMOLO_SPREAD_STEP = 1; // Incremento de propagación
export const TREMOLO_SPREAD_DEFAULT = 180; // Valor por defecto
export const TREMOLO_SPREAD_UNIT = "°"; // Unidad de medida

// Type (forma de onda)
export const TREMOLO_TYPE_SINE = "sine";
export const TREMOLO_TYPE_SQUARE = "square";
export const TREMOLO_TYPE_TRIANGLE = "triangle";
export const TREMOLO_TYPE_SAWTOOTH = "sawtooth";
export const TREMOLO_TYPE_DEFAULT = TREMOLO_TYPE_SINE; // Valor por defecto
export const TREMOLO_TYPE_UNIT = ""; // Adimensional

// Wet (mezcla)
export const TREMOLO_WET_MIN = 0; // Nivel mínimo de mezcla
export const TREMOLO_WET_MAX = 1; // Nivel máximo de mezcla
export const TREMOLO_WET_STEP = 0.1; // Incremento del nivel de mezcla
export const TREMOLO_WET_DEFAULT = 0.5; // Valor por defecto
export const TREMOLO_WET_UNIT = ""; // Adimensional

// DELAY

// Delay Time (tiempo de retardo)
export const DELAY_TIME_MIN = 0; // Tiempo mínimo de retardo en segundos
export const DELAY_TIME_MAX = 2; // Tiempo máximo de retardo en segundos
export const DELAY_TIME_STEP = 0.01; // Incremento del tiempo de retardo
export const DELAY_TIME_DEFAULT = 0.25; // Valor por defecto
export const DELAY_TIME_UNIT = "s"; // Unidad de medida

// Feedback (retroalimentación)
export const DELAY_FEEDBACK_MIN = 0; // Retroalimentación mínima
export const DELAY_FEEDBACK_MAX = 0.99; // Retroalimentación máxima // 1 crea un bucle infinito
export const DELAY_FEEDBACK_STEP = 0.01; // Incremento de retroalimentación
export const DELAY_FEEDBACK_DEFAULT = 0.5; // Valor por defecto
export const DELAY_FEEDBACK_UNIT = ""; // Adimensional

// Max Delay (retardo máximo)
export const DELAY_MAX_DELAY_MIN = 0.1; // Retardo mínimo en segundos
export const DELAY_MAX_DELAY_MAX = 5; // Retardo máximo en segundos
export const DELAY_MAX_DELAY_STEP = 0.1; // Incremento del retardo
export const DELAY_MAX_DELAY_DEFAULT = 0.25; // Valor por defecto
export const DELAY_MAX_DELAY_UNIT = "s"; // Unidad de medida

// Wet (mezcla)
export const DELAY_WET_MIN = 0; // Nivel mínimo de mezcla
export const DELAY_WET_MAX = 1; // Nivel máximo de mezcla
export const DELAY_WET_STEP = 0.1; // Incremento del nivel de mezcla
export const DELAY_WET_DEFAULT = 0.5; // Valor por defecto
export const DELAY_WET_UNIT = ""; // Adimensional


// PHASER

// Frequency (frecuencia)
export const PHASER_FREQUENCY_MIN = 0.1; // Frecuencia mínima en Hz
export const PHASER_FREQUENCY_MAX = 10; // Frecuencia máxima en Hz
export const PHASER_FREQUENCY_STEP = 0.1; // Incremento de frecuencia
export const PHASER_FREQUENCY_DEFAULT = 0.5; // Valor por defecto
export const PHASER_FREQUENCY_UNIT = "Hz"; // Unidad de medida

// Octaves (octavas)
export const PHASER_OCTAVES_MIN = 0; // Número mínimo de octavas
export const PHASER_OCTAVES_MAX = 7; // Número máximo de octavas
export const PHASER_OCTAVES_STEP = 1; // Incremento de octavas
export const PHASER_OCTAVES_DEFAULT = 3; // Valor por defecto
export const PHASER_OCTAVES_UNIT = ""; // Adimensional

// Stages (etapas)
export const PHASER_STAGES_MIN = 1; // Número mínimo de etapas
export const PHASER_STAGES_MAX = 12; // Número máximo de etapas
export const PHASER_STAGES_STEP = 1; // Incremento de etapas
export const PHASER_STAGES_DEFAULT = 4; // Valor por defecto
export const PHASER_STAGES_UNIT = ""; // Adimensional

// Q (factor de calidad)
export const PHASER_Q_MIN = 1; // Valor mínimo de Q
export const PHASER_Q_MAX = 100; // Valor máximo de Q
export const PHASER_Q_STEP = 1; // Incremento de Q
export const PHASER_Q_DEFAULT = 10; // Valor por defecto
export const PHASER_Q_UNIT = ""; // Adimensional

// Base Frequency (frecuencia base)
export const PHASER_BASE_FREQUENCY_MIN = 20; // Frecuencia base mínima en Hz
export const PHASER_BASE_FREQUENCY_MAX = 2000; // Frecuencia base máxima en Hz
export const PHASER_BASE_FREQUENCY_STEP = 10; // Incremento de frecuencia base
export const PHASER_BASE_FREQUENCY_DEFAULT = 350; // Valor por defecto
export const PHASER_BASE_FREQUENCY_UNIT = "Hz"; // Unidad de medida

// Wet (mezcla)
export const PHASER_WET_MIN = 0; // Nivel mínimo de mezcla
export const PHASER_WET_MAX = 1; // Nivel máximo de mezcla
export const PHASER_WET_STEP = 0.1; // Incremento del nivel de mezcla
export const PHASER_WET_DEFAULT = 0.5; // Valor por defecto
export const PHASER_WET_UNIT = ""; // Adimensional


// EQ3

// Low (bajos)
export const EQ3_LOW_MIN = -20; // Ganancia mínima en dB
export const EQ3_LOW_MAX = 20; // Ganancia máxima en dB
export const EQ3_LOW_STEP = 1; // Incremento de ganancia
export const EQ3_LOW_DEFAULT = 0; // Valor por defecto
export const EQ3_LOW_UNIT = "dB"; // Unidad de medida

// Mid (medios)
export const EQ3_MID_MIN = -20; // Ganancia mínima en dB
export const EQ3_MID_MAX = 20; // Ganancia máxima en dB
export const EQ3_MID_STEP = 1; // Incremento de ganancia
export const EQ3_MID_DEFAULT = 0; // Valor por defecto
export const EQ3_MID_UNIT = "dB"; // Unidad de medida

// High (altos)
export const EQ3_HIGH_MIN = -20; // Ganancia mínima en dB
export const EQ3_HIGH_MAX = 20; // Ganancia máxima en dB
export const EQ3_HIGH_STEP = 1; // Incremento de ganancia
export const EQ3_HIGH_DEFAULT = 0; // Valor por defecto
export const EQ3_HIGH_UNIT = "dB"; // Unidad de medida

// Low Frequency (frecuencia de corte para bajos)
export const EQ3_LOW_FREQUENCY_MIN = 50; // Frecuencia mínima en Hz
export const EQ3_LOW_FREQUENCY_MAX = 1000; // Frecuencia máxima en Hz
export const EQ3_LOW_FREQUENCY_STEP = 10; // Incremento de frecuencia
export const EQ3_LOW_FREQUENCY_DEFAULT = 400; // Valor por defecto
export const EQ3_LOW_FREQUENCY_UNIT = "Hz"; // Unidad de medida

// High Frequency (frecuencia de corte para altos)
export const EQ3_HIGH_FREQUENCY_MIN = 1000; // Frecuencia mínima en Hz
export const EQ3_HIGH_FREQUENCY_MAX = 8000; // Frecuencia máxima en Hz
export const EQ3_HIGH_FREQUENCY_STEP = 100; // Incremento de frecuencia
export const EQ3_HIGH_FREQUENCY_DEFAULT = 2500; // Valor por defecto
export const EQ3_HIGH_FREQUENCY_UNIT = "Hz"; // Unidad de medida

// Wet (mezcla)
export const EQ3_WET_MIN = 0; // Nivel mínimo de mezcla
export const EQ3_WET_MAX = 1; // Nivel máximo de mezcla
export const EQ3_WET_STEP = 0.1; // Incremento del nivel de mezcla
export const EQ3_WET_DEFAULT = 0.5; // Valor por defecto
export const EQ3_WET_UNIT = ""; // Adimensional


// COMPRESSOR

// Threshold (umbral)
export const COMPRESSOR_THRESHOLD_MIN = -60; // Umbral mínimo en dB
export const COMPRESSOR_THRESHOLD_MAX = 0; // Umbral máximo en dB
export const COMPRESSOR_THRESHOLD_STEP = 1; // Incremento del umbral
export const COMPRESSOR_THRESHOLD_DEFAULT = -24; // Valor por defecto
export const COMPRESSOR_THRESHOLD_UNIT = "dB"; // Unidad de medida

// Ratio (relación de compresión)
export const COMPRESSOR_RATIO_MIN = 1; // Relación mínima
export const COMPRESSOR_RATIO_MAX = 20; // Relación máxima
export const COMPRESSOR_RATIO_STEP = 1; // Incremento de la relación
export const COMPRESSOR_RATIO_DEFAULT = 12; // Valor por defecto
export const COMPRESSOR_RATIO_UNIT = ""; // Adimensional

// Attack (ataque)
export const COMPRESSOR_ATTACK_MIN = 0.001; // Tiempo mínimo de ataque en segundos
export const COMPRESSOR_ATTACK_MAX = 1; // Tiempo máximo de ataque en segundos
export const COMPRESSOR_ATTACK_STEP = 0.001; // Incremento del tiempo de ataque
export const COMPRESSOR_ATTACK_DEFAULT = 0.003; // Valor por defecto
export const COMPRESSOR_ATTACK_UNIT = "s"; // Unidad de medida

// Release (liberación)
export const COMPRESSOR_RELEASE_MIN = 0.01; // Tiempo mínimo de liberación en segundos
export const COMPRESSOR_RELEASE_MAX = 1; // Tiempo máximo de liberación en segundos
export const COMPRESSOR_RELEASE_STEP = 0.01; // Incremento del tiempo de liberación
export const COMPRESSOR_RELEASE_DEFAULT = 0.25; // Valor por defecto
export const COMPRESSOR_RELEASE_UNIT = "s"; // Unidad de medida

// Knee (rodilla)
export const COMPRESSOR_KNEE_MIN = 0; // Valor mínimo de la rodilla en dB
export const COMPRESSOR_KNEE_MAX = 40; // Valor máximo de la rodilla en dB
export const COMPRESSOR_KNEE_STEP = 1; // Incremento de la rodilla
export const COMPRESSOR_KNEE_DEFAULT = 30; // Valor por defecto
export const COMPRESSOR_KNEE_UNIT = "dB"; // Unidad de medida

// Wet (mezcla)
export const COMPRESSOR_WET_MIN = 0; // Nivel mínimo de mezcla
export const COMPRESSOR_WET_MAX = 1; // Nivel máximo de mezcla
export const COMPRESSOR_WET_STEP = 0.1; // Incremento del nivel de mezcla
export const COMPRESSOR_WET_DEFAULT = 0.5; // Valor por defecto
export const COMPRESSOR_WET_UNIT = ""; // Adimensional


// AUTOWAH

// Base Frequency (frecuencia base)
export const AUTOWAH_BASE_FREQUENCY_MIN = 20; // Frecuencia base mínima en Hz
export const AUTOWAH_BASE_FREQUENCY_MAX = 2000; // Frecuencia base máxima en Hz
export const AUTOWAH_BASE_FREQUENCY_STEP = 10; // Incremento de frecuencia base
export const AUTOWAH_BASE_FREQUENCY_DEFAULT = 100; // Valor por defecto
export const AUTOWAH_BASE_FREQUENCY_UNIT = "Hz"; // Unidad de medida

// Octaves (octavas)
export const AUTOWAH_OCTAVES_MIN = 0; // Número mínimo de octavas
export const AUTOWAH_OCTAVES_MAX = 10; // Número máximo de octavas
export const AUTOWAH_OCTAVES_STEP = 0.1; // Incremento de octavas
export const AUTOWAH_OCTAVES_DEFAULT = 2.6; // Valor por defecto
export const AUTOWAH_OCTAVES_UNIT = ""; // Adimensional

// Sensitivity (sensibilidad)
export const AUTOWAH_SENSITIVITY_MIN = -40; // Sensibilidad mínima en dB
export const AUTOWAH_SENSITIVITY_MAX = 0; // Sensibilidad máxima en dB
export const AUTOWAH_SENSITIVITY_STEP = 1; // Incremento de sensibilidad
export const AUTOWAH_SENSITIVITY_DEFAULT = 0; // Valor por defecto
export const AUTOWAH_SENSITIVITY_UNIT = "dB"; // Unidad de medida

// Q (factor de calidad)
export const AUTOWAH_Q_MIN = 0.1; // Valor mínimo de Q
export const AUTOWAH_Q_MAX = 10; // Valor máximo de Q
export const AUTOWAH_Q_STEP = 0.1; // Incremento de Q
export const AUTOWAH_Q_DEFAULT = 2; // Valor por defecto
export const AUTOWAH_Q_UNIT = ""; // Adimensional

// Gain (ganancia)
export const AUTOWAH_GAIN_MIN = 0; // Ganancia mínima
export const AUTOWAH_GAIN_MAX = 10; // Ganancia máxima
export const AUTOWAH_GAIN_STEP = 0.1; // Incremento de ganancia
export const AUTOWAH_GAIN_DEFAULT = 2; // Valor por defecto
export const AUTOWAH_GAIN_UNIT = "dB"; // Adimensional

// Follower (seguidor)
export const AUTOWAH_FOLLOWER_MIN = 0; // Nivel mínimo del seguidor
export const AUTOWAH_FOLLOWER_MAX = 1; // Nivel máximo del seguidor
export const AUTOWAH_FOLLOWER_STEP = 0.05; // Incremento del seguidor
export const AUTOWAH_FOLLOWER_DEFAULT = 0.2; // Valor por defecto
export const AUTOWAH_FOLLOWER_UNIT = "s"; // Adimensional

// Wet (mezcla)
export const AUTOWAH_WET_MIN = 0; // Nivel mínimo de mezcla
export const AUTOWAH_WET_MAX = 1; // Nivel máximo de mezcla
export const AUTOWAH_WET_STEP = 0.1; // Incremento del nivel de mezcla
export const AUTOWAH_WET_DEFAULT = 0.5; // Valor por defecto
export const AUTOWAH_WET_UNIT = ""; // Adimensional