export function onUpdateAvailable(cb: () => void){
  if ((window as any).blckbolt && (window as any).blckbolt.onUpdateAvailable){
    (window as any).blckbolt.onUpdateAvailable(cb);
  }
}
