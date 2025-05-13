export function initLocacaoList() {
    const addButton = document.getElementById('addButton');
    if (addButton) {
        addButton.addEventListener('click', () => {
            window.history.pushState({}, '', '/locacao-add');
            // Dispatch a custom event to notify the router
            window.dispatchEvent(new CustomEvent('routeChange', {
                detail: { path: '/locacao-add' }
            }));
        });
    }
} 