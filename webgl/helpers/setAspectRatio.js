export default function setAspectRatio(target) {
  const imageAspect = target.naturalHeight / target.naturalWidth;
  const width =  target.offsetWidth || target.width;
  const height = target.offsetHeight || target.height;
  let z;
  let w;

  if (height / width > imageAspect) {
      z = (width / height) * imageAspect;
      w = 1;
    } else {
      z = 1;
      w = height / width / imageAspect;
    }
  const x = width;
  const y = height;

  return {x, y, z, w};
} 