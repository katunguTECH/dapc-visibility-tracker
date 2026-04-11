// Add this at the VERY TOP of layout.tsx, before any imports
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (event.error?.message?.includes('Element type is invalid')) {
      console.group('🔴 REACT ERROR #130 DETECTED ON PAGE LOAD');
      console.error('Original error:', event.error);
      console.log('Stack trace:', event.error?.stack);
      
      // Try to parse the stack trace to find the component
      const stackLines = event.error?.stack?.split('\n') || [];
      const reactLine = stackLines.find(line => line.includes('react-dom'));
      if (reactLine) {
        console.log('Failed at:', reactLine);
      }
      console.groupEnd();
      
      // Create visible debug box on page
      const debugDiv = document.createElement('div');
      debugDiv.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        background: red;
        color: white;
        padding: 10px;
        border-radius: 5px;
        z-index: 10000;
        font-size: 12px;
        max-width: 300px;
      `;
      debugDiv.innerHTML = `
        <strong>React Error #130</strong><br>
        Check console for details<br>
        <button onclick="this.parentElement.remove()" style="margin-top:5px">Dismiss</button>
      `;
      document.body.appendChild(debugDiv);
    }
  });
}