const app = new (require('./application'))();

app.use((ctx, next) => {
    console.log('ctx1----------------')
    ctx.body = 'a';
    next();
    console.log('end ----- ctx1')
})

app.use((ctx, next) => {
    console.log('ctx2----------------')
    ctx.body += 'b';
    next();
    console.log('end ----- ctx2')

})

app.use((ctx, next) => {
    console.log('ctx3----------------')
    ctx.body += 'c';
    console.log('end ----- ctx3')

})
app.listen(3000, function() {
    console.log('..............index.js')
})