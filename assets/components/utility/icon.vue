<template>
    <svg :class = "className">
        <use v-bind="{'xlink:href':baseUrl + base + '.svg#' + name}"></use>
    </svg>
</template>
<script>
    export default {
        data() {
            return {
                baseUrl: '/assets/static/images/sprite/'
            };
        },
        props:{
            name: {
                required: true,
                type: String
            },
            base: {
                required: true,
                type: String
            },
            className: {
                type: String
            }
        }
    }
</script>