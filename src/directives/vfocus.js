export default {
  name: 'focus',

  mounted(el, { value: predicate }) {
    // Выполняем функцию, если predicate не передан (undefined) или равен true
    if (predicate === false) return

    // все элементы на которых возможен фокус
    const focusableSelectors = [
      'input',
      'select',
      'textarea',
      'button',
      'a[href]'
    ]

    // функция проверяет можно ли дать фокус элементу
    const isFocusable = (element) =>
      focusableSelectors.some((selector) => element.matches(selector))

    // фокус на элементе если isFocusable
    if (isFocusable(el)) {
      el.focus()
    } else {
      // иначе пытаемся дать фокус предку
      const focusableChild = el.querySelector(focusableSelectors.join(', '))

      if (focusableChild) {
        focusableChild.focus()
      }
    }
  }
}
