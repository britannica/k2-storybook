import Spine from '../lib/spine-widget.js';

const Component = async() => {
    return {
        name: 'spine-widget',
        template: `<div spine-widget></div>`,
        props: {
            json: {
                required: true
            },
            atlas: {
                required: true
            },
            animation: {
                required: true
            },
            backgroundColor: {
                required: false,
                default: "#00000000"
            }
        },
        data: function () {
            return {
                
            }
        },
        mounted(){
            new Spine.SpineWidget(this.$el, {
                json: this.json,
                atlas: this.atlas,
                animation: this.animation,
                backgroundColor: this.backgroundColor,
                success: (widget) => {
                    this.widget = widget;

                    var animIndex = 0;
                    widget.canvas.onclick = function () {
                        animIndex++;
                        var animations = widget.skeleton.data.animations;
                        if (animIndex >= animations.length) animIndex = 0;
                        widget.setAnimation(animations[animIndex].name);
                    }
                }
            });
        },
        methods: {

        }
    }
}

export default Component;