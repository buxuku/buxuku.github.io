hexo.extend.generator.register('generator-readme', function (locals) {
    const { order_by = '-date' , categories: categoriesFilter } = hexo.config.generator_readme;
    let categoriesFiltered = categoriesFilter ? locals.categories.filter(item => !!categoriesFilter[item.name]) : locals.categories;
    let categories = [];

    categoriesFilter && categoriesFiltered.data.sort((a, b) => {
        return categoriesFilter[a.name] - categoriesFilter[b.name];
    })
    categoriesFiltered.data.forEach((item,index) => {
        const obj = {...item};
        obj.posts = item.posts.sort(order_by).data.filter(item => !item.skipInReadme);
        categories.push(obj);
    })

    locals.categories = categories;
    return {
        path: 'README.md',
        data: locals,
        layout: ['readme']
    }
});