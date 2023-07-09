import { View } from "~~/types/general";

type Theme = 'light' | 'dark'

export default function () {
  const view = useState<View>("view", () => null);
  const rem = useState<number>("rem", () => 24);
  const init = useState<boolean>('init', () => true)
  const theme = useState<Theme>('theme', () => 'light')

  const getTheme = (): Theme => {
    const stored = localStorage?.getItem('theme') || ''
    if (stored === 'light' || stored === 'dark') {
      theme.value = stored
    } else if (window?.matchMedia('prefers-color-scheme: dark').matches) {
      theme.value = 'dark'
    }
    return theme.value
  }
  const setTheme = (data: Theme): Theme => {
    localStorage.setItem('theme', data)
    theme.value = data
    return theme.value
  }

  return { rem, view, init, theme, getTheme, setTheme };
}
