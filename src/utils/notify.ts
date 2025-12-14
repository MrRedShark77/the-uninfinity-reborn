const Colors = {
  'normal': 'white',
  'success': 'limegreen',
  'warn': 'yellow',
  'error': 'orangered',
}

export type NotifyMode = keyof typeof Colors

export function notify(text: string, mode: NotifyMode = 'normal', duration: number = 5000) {
  const element = document.createElement("div");

  element.className = 'notification';
  element.style.setProperty('--n-color', Colors[mode]);
  element.style.setProperty('--n-duration', `${duration}ms`);
  element.innerHTML = text;

  document.getElementById('notifications')?.append(element)

  let ST_id: number;
  function ended() {
    element.animate({
      'transform': ['translateX(0px)', 'translateX(calc(100% + 10px))'],
    },{
      duration: 400,
      easing: 'ease-in-out',
      fill: 'forwards'
    }).onfinish = () => {
      element.remove();
    };
  }

  element.addEventListener('click', () => {
    if (ST_id === 0)
      return;
    clearTimeout(ST_id)
    ST_id = 0;
    ended()
  })

  element.animate({
    'transform': ['translateX(calc(100% + 10px))', 'translateX(0px)'],
  },{
    duration: 400,
    easing: 'ease-in-out',
    fill: 'forwards'
  })

  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    element.style.setProperty('--n-percent','0%')
    ST_id = setTimeout(ended, duration);
  }))
}
