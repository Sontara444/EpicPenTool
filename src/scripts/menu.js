export function setupMenuToggle(toolbarId, buttonId, iconPathVisible, iconPathHidden) {
    const toolbar = document.getElementById(toolbarId);
    const menuBtn = document.getElementById(buttonId);
    let toolbarVisible = true;
  
    if (!toolbar || !menuBtn) return;
  
    menuBtn.addEventListener('click', () => {
      toolbarVisible = !toolbarVisible;
  
      const toolbarChildren = Array.from(toolbar.children).filter(
        (child) => child !== menuBtn
      );
  
      toolbarChildren.forEach((child) => {
        child.style.display = toolbarVisible ? '' : 'none';
      });
  
      const img = menuBtn.querySelector('img');
      if (img) {
        img.src = toolbarVisible ? iconPathVisible : iconPathHidden;
      }
    });
  }
  