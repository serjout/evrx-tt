module.exports = {
    skipComponentsWithoutExample: true,
    components: 'src/front/components/**/*.jsx',
    context: {
        _: 'lodash',
        mobx: 'mobx',
        mobxReact: 'mobx-react',
        moment: 'moment',
    },
    theme: {
        maxWidth: 1200,
    },
    styles: {
        Playground: {
            preview: {
                fontFamily:
                    'Roboto, Helvetica Neue, Helvetica, Arial, sans-serif ',
                fontSize: '14px',
            },
        },
    }
};