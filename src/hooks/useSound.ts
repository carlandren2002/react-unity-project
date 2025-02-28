import { useEffect } from 'react';
import Sound from 'react-native-sound';

Sound.setCategory('Playback');

/**
 * Hook to dynamically play sounds without delay.
 *
 * This hook returns functions to play 'success', 'fail', and 'info' sounds.
 * Each time a sound is played, a new instance of the sound is created to avoid
 * delays or playback issues.
 *
 * @returns an object with play functions for each sound type.
 */
const useSound = () => {
  const playSound = (name: string) => {
    const sound = new Sound(`${name}.mp3`, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log(`Failed to load the sound ${name}`, error);
        return;
      }
      sound.play(() => {
        sound.release(); // Release the sound instance after playback.
      });
    });
  };

  return {
    playSuccess: () => playSound('success2'),
    playFail: () => playSound('fail'),
    playInfo: () => playSound('info'),
  };
};

export default useSound;