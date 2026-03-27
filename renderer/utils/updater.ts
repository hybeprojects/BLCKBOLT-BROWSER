export function onUpdateAvailable(cb: () => void){
  if (window.blckboltAPI && window.blckboltAPI.on){
    window.blckboltAPI.on('update-available', cb);
  }
}
