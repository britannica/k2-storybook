const Component = async() => {
    let template = await fetch('styles/main.css');
    template = await template.text();

    return {
        name: 'import-style',
        template: `<style>${template}</style>`
    }
}

export default Component;