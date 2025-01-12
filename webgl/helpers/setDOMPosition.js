export default function setDOMPosition({ mesh, target, clientRect, translate }) {
  const { left, top, scale } = translate;
  let zIndex = window.getComputedStyle(target).getPropertyValue('z-index');

  zIndex = zIndex === 'auto' ? 0 : parseInt(zIndex);

  mesh.scale.set(
    clientRect.width * scale, clientRect.height * scale, 100
  );

  mesh.position.set(
    (left + clientRect.left + clientRect.width / 2 - window.innerWidth / 2) * scale,
    (top - clientRect.top - clientRect.height / 2 + window.innerHeight / 2) * scale,
    zIndex
  );

  return clientRect;
}