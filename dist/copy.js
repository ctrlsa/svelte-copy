export function copyText(text) {
    return new Promise((t => {
        navigator.clipboard.writeText(text).then((() => {
            t(text);
        })).catch((() => {
            const el = document.createElement('input');
            el.style.opacity = '0',
                el.style.position = 'fixed',
                el.value = text,
                document.body.appendChild(el),
                el.select(),
                document.execCommand('copy', !1, ""),
                el.remove(),
                t(text);
        }));
    }));
}
export const copy = (element, params) => {
    async function handle() {
        if (text)
            try {
                await copyText(text);
                element.dispatchEvent(new CustomEvent('svelte-copy', { detail: text }));
            }
            catch (e) {
                element.dispatchEvent(new CustomEvent('svelte-copy:error', { detail: e }));
            }
    }
    let events = typeof params == 'string' ? ['click'] : [params.events].flat(1);
    let text = typeof params == 'string' ? params : params.text;
    events.forEach((event) => {
        element.addEventListener(event, handle, true);
    });
    return {
        update: (newParams) => {
            const newEvents = typeof newParams == 'string' ? ['click'] : [newParams.events].flat(1);
            const newText = typeof newParams == 'string' ? newParams : newParams.text;
            const addedEvents = newEvents.filter((x) => !events.includes(x));
            const removedEvents = events.filter((x) => !newEvents.includes(x));
            addedEvents.forEach((event) => {
                element.addEventListener(event, handle, true);
            });
            removedEvents.forEach((event) => {
                element.removeEventListener(event, handle, true);
            });
            events = newEvents;
            text = newText;
        },
        destroy: () => {
            events.forEach((event) => {
                element.removeEventListener(event, handle, true);
            });
        },
    };
};
