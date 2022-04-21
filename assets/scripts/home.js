const cart = document.querySelectorAll('.add-to-cart');

$(document).ready(function(){
    $('.add-to-cart').on('click', function(){
        let foodId = $(this).attr('foodId')
        updateCart(foodId)
    })
    
    const updateCart = (food) =>{
    
        $.ajax({
            type: 'get',
            url: `/cart/update-cart/${food}`,
            success: (data) => {
                new Noty({
                    theme: 'sunset',
                    text: "Cart updated!",
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1000
                    
                }).show();
                $('.cart-counter').text(data.cart.totalItems);
            },
            error: (err) => {
                new Noty({
                    theme: 'sunset',
                    text: "Error!",
                    type: 'error',
                    layout: 'topRight',
                    timeout: 1000
                    
                }).show();
            }
        })
    }
})