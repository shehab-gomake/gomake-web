/**
 * Play a notification sound using Web Audio API
 * Creates a pleasant beep sound to alert users
 */
export const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Configure sound: pleasant notification beep
    oscillator.frequency.value = 800; // Frequency in Hz (pleasant beep)
    oscillator.type = 'sine'; // Sine wave for smooth sound

    // Set volume envelope (fade in/out for pleasant sound)
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01); // Quick fade in
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3); // Fade out

    // Play the sound
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3); // Stop after 300ms

    // Clean up after sound finishes
    oscillator.onended = () => {
      audioContext.close();
    };
  } catch (error) {
    console.error('Error playing notification sound:', error);
    // Fallback: Try using HTML5 Audio API if Web Audio API fails
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi77+efTRAMUKfj8LZjHAY4kdfyzHksBSR3x/DdkEAKFF206OuoVRQKRp/g8r5sIQUqgc7y2Yk2CBlou+/nn00QDFCn4/C2YxwGOJHX8sx5LAUkd8fw3ZBAC');
      audio.volume = 0.3;
      audio.play().catch((err) => {
        console.error('Error playing fallback notification sound:', err);
      });
    } catch (fallbackError) {
      console.error('Fallback notification sound also failed:', fallbackError);
    }
  }
};

