import remarkFrontmatter from 'remark-frontmatter';

const extraFlags = {
    output: 'export',
    images: {
        unoptimized: true
    }
}
export default {
    webpack: (config, options) => {
        config.module.rules.push({
            test: /\.mdx?$/,
            use: [
            options.defaultLoaders.babel,
            {
                loader: '@mdx-js/loader',
                options: {
                providerImportSource: '@mdx-js/react',
                remarkPlugins: [remarkFrontmatter],
                },
            },
            ],
        });
    
        return config;
    },
    pageExtensions: ['js', 'jsx', 'md', 'mdx'],
    ...extraFlags
};