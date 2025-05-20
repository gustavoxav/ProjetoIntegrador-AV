export function initLocacaoList() {
    const addButton = document.getElementById('addButton');
    
    if (addButton) {
        addButton.addEventListener('click', () => {
            window.history.pushState({}, '', '/locacao-add');
            window.dispatchEvent(new CustomEvent('routeChange', {
                detail: { path: '/locacao-add' }
            }));
        });
    }
} 