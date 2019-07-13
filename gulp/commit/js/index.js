$.ajax({
    url: '/api/list',
    dataType: 'json',
    success: function(data) {
        list.innerHTML = data.map(function(item, i) {
            return `<li>${item.name}${item.age}</li>`
        }).join('')
    }
})