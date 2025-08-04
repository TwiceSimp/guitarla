import { useState, useEffect, useMemo } from "react"
import { db } from "../data/db"


export const useCart = () => {

    const initialCart = () => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }

    const [data] = useState(db)
    const[cart, setCart] = useState(initialCart)

    const MAX_ITEMS = 5 //Limitar a 10 unidades por producto
    const MIN_ITEMS = 1 //Cantidad minima de un producto

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    function addToCart(item){

        const itemExists = cart.findIndex(guitar => guitar.id === item.id)
        if(itemExists >= 0) { //Existe en el carrito
            if(cart[itemExists].quantity >= MAX_ITEMS) return //Si ya tiene 10 unidades, no se puede agregar mas
            const updatedCart = [...cart]
            updatedCart[itemExists].quantity ++
            setCart(updatedCart)
        } else{
            item.quantity = 1 //Si no existe, le asignamos una cantidad
            setCart([...cart, item])
        }

        
    }

    function removeFromCart(id){
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
    }

    function increaseQuantity(id) {
        const updatedCart = cart.map(item => {
            if(item.id === id && item.quantity < MAX_ITEMS) { //Limitar a 10 unidades
                return {...item, quantity: item.quantity + 1}
            }
            return item
        })
        setCart(updatedCart)
    }

    function decreaseQuantity(id) {
        const updatedCart = cart.map(item => {
            if(item.id === id && item.quantity > MIN_ITEMS) { 
                return {...item, quantity: item.quantity - 1}
            }
            return item
        })
        setCart(updatedCart)
    }

    function clearCart() {
        setCart([])
    }

     //State derivado
    const isEmpty =useMemo(() => cart.length === 0, [cart]) 
    const cartTotal =useMemo( () => cart.reduce((total, item) => total + (item.quantity * item.price), 0),[cart])

    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }
}

