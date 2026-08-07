export function setupMenuToggle(toolbarId, buttonId, iconPathVisible, iconPathHidden) {
    const toolbar = document.getElementById(toolbarId);
    const menuBtn = document.getElementById(buttonId);
    let toolbarVisible = true;
  
    if (!toolbar || !menuBtn) return;
  
    menuBtn.addEventListener('click', () => {
      toolbarVisible = !toolbarVisible;
  
      const toolbarChildren = Array.from(toolbar.children).filter(
        (child) => child !== menuBtn && !child.classList.contains('toolbar-logo') && child.id !== 'dragArea'
      );
  
      toolbarChildren.forEach((child) => {
        child.style.display = toolbarVisible ? '' : 'none';
      });
  
      const iconOpen = menuBtn.querySelector('.icon-open');
      const iconClosed = menuBtn.querySelector('.icon-closed');
      
      if (iconOpen && iconClosed) {
        iconOpen.style.display = toolbarVisible ? 'block' : 'none';
        iconClosed.style.display = toolbarVisible ? 'none' : 'block';
      } else {
        // Fallback for img
        const img = menuBtn.querySelector('img');
        if (img) {
          img.src = toolbarVisible ? iconPathVisible : iconPathHidden;
        }
      }
    });
  }
  