// Import THREE Experience
import Experience from './webgl/Experience';
import { data } from './data';

export let experience;

window.addEventListener('DOMContentLoaded', () => {
  experience = new Experience(document.querySelector('canvas.experience__canvas'), data);
})
