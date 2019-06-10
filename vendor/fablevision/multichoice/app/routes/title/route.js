import SpineWidget from '../../components/spine-widget.js';

const Route = async() => {
    let template = await fetch('routes/title/index.html');
    template = await template.text();

    return {
        template,
        components: { SpineWidget },
        data: function(){
            return {
                message: "intro"
            }
        },
        methods: {
            next: function(){
                this.$root.navigate('game');
            }
        }
    }
}

export default Route;