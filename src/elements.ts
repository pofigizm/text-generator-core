/**
 * Создание элементов
 * @description Функционал реализован для JSX-шаблонизатора. Элементы могут быть только трёх типов: «sentence»,
 * «fragment» и «template». Элементы должны следовать иерархии: sentence —> fragment —> template
 */
import { DictionaryItem, RandomItemGetter } from './dictionary'

/** Типы элементов export */
type TypeOfElement = 'sentence' | 'fragment' | 'template'

/** Элемента шаблона */
export interface Element {
  type:     TypeOfElement
  props:    { [prop: string]: any }
  children: (string | Element | Function | DictionaryItem)[]
}

/** Элемент предложения */
export interface SentenceElement extends Element {
  type:     'sentence'
  children: (FragmentElement | string)[]
}

/** Элемент фрагмента */
export interface FragmentElement extends Element {
  type:     'fragment'
  children: TemplateElement[]
}

/** Элемент шаблона */
export interface TemplateElement extends Element {
  type:     'template'
  children: (string | RandomItemGetter | DictionaryItem)[]
}

/**
 * Создаёт элемент шаблона по типу
 * @param {string}           type     Тип элемента
 * @param {Object}           props    Параметры элемента
 * @param {...object|string} children Дочерние элементы
 */
export function createElement(type: 'sentence', props?: {}, ...children: FragmentElement[]): SentenceElement
export function createElement(type: 'fragment', props?: {}, ...children: TemplateElement[]): FragmentElement
export function createElement(type: 'template', props?: {}, ...children: (string | RandomItemGetter)[]): TemplateElement
export function createElement(
  type: TypeOfElement,
  props?: {},
  ...children: (string | Element | RandomItemGetter)[],
): Element {
  const propsFallBack = props == null
    ? {}
    : props

  switch (type) {
    case 'sentence': {
      return createSentenceElement(propsFallBack, ...children as FragmentElement[])
    }

    case 'fragment': {
      return createFragmentElement(propsFallBack, ...children as TemplateElement[])
    }

    case 'template': {
      return createTemplateElement(propsFallBack, ...children as (string | RandomItemGetter)[])
    }

    default: {
      throw new Error('Неизвестный тип элемента')
    }
  }
}

/**
 * Создаёт элемент предложения
 * @param  {object}             props     Параметры элемента
 * @param  {...FragmentElement} children  Дочерние элементы
 * @return {SentenceElement}
 */
export function createSentenceElement(props: object, ...children: FragmentElement[]): SentenceElement {
  const filteredChildren: FragmentElement[] = children.filter((child: Element) => {
    if (typeof child !== 'object' && typeof child !== 'string') {
      return false
    }

    if (typeof child === 'object' && child.type !== 'fragment') {
      throw new Error('Элемент «sentence» может иметь только дочерние элементы с типом «fragment»')
    }

    return true
  })

  return {
    type: 'sentence',
    props,
    children: filteredChildren,
  }
}

/**
 * Создаёт элемент фрагмента предложения
 * @param  {object}             props     Параметры элемента
 * @param  {...TemplateElement} children  Дочерние элементы
 * @return {FragmentElement}
 */
export function createFragmentElement(props: object, ...children: TemplateElement[]): FragmentElement {
  children.forEach((child: Element) => {
    if (child.type !== 'template') {
      throw new Error('Элемент «fragment» может иметь только дочерние элементы с типом «template»')
    }
  })

  return {
    type: 'fragment',
    props,
    children,
  }
}

/**
 * Создаёт элемент шаблона фрагмента
 * @param  {object}               props     Параметры элемента
 * @param  {...(string|Function)} children  Дочерние элементы
 * @return {TemplateElement}
 */
export function createTemplateElement(props: object, ...children: (string | RandomItemGetter)[]): TemplateElement {
  children.forEach((child: string | Function | DictionaryItem) => {
    if (typeof child !== 'string' && typeof child !== 'function' && !Array.isArray(child)) {
      throw new Error(
        'Элемент «template» может иметь в качестве дочерних элементов только строки, ' +
        'элементы словаря или функции, возвращаемые элементы словаря.'
      )
    }
  })

  return {
    type: 'template',
    props,
    children
  }
}
