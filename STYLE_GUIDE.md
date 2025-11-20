This style guide defines the visual and structural standards for the **Community Support Tracker** project. 

All team members should follow these guidelines to ensure a consistent and professional user experience across all pages.

## Color Palette

| Purpose              | Color Name        | Hex Code   | Usage Example                          |
|----------------------|-------------------|------------|----------------------------------------|
| Primary              | River Blue        | `#0077CC`  | Navbar background, buttons             |
| Accent 1             | Volunteer Green   | `#8BC34A`  | Section 1 background                   |
| Accent 2             | Donation Yellow   | `#FFF59D`  | Section 2 background                   |
| Accent 3             | Event Pink        | `#F48FB1`  | Section 3 background                   |
| Header/Footer        | Soft Gray         | `#CCCCCC`  | Header and footer background           |
| Text (Dark)          | Charcoal          | `#333333`  | Main body text                         |
| Text (Light)         | White             | `#FFFFFF`  | Nav links, buttons                     |

## Typography

- **Font Family**:  
  - Primary: `Arial, sans-serif`
  - Fallbacks: `Helvetica, sans-serif`

- **Font Sizes**:
  - Page Title (`<h1>`): `2rem`
  - Section Headings (`<h2>`): `1.5rem`
  - Body Text: `1rem`
  - Nav Links / Buttons: `1rem`, bold

## Layout & Spacing

- **Max Width**: `1200px` centered
- **Section Padding**: `1rem` top and bottom
- **Mobile Breakpoint**: `768px`
- **Header/Nav/Footer**: Full width, consistent padding

## Responsive Design

- Use **Flexbox** or **CSS Grid** for layout
- Hamburger menu appears at `max-width: 768px`
- Nav links stack vertically on mobile
- Sections collapse into a single column on mobile

## Navigation

- Use semantic `<nav>` with `<ul><li><a></a></li></ul>`
- Highlight the active page with `.active` class:
  ```css
  nav a.active {
    background-color: #005fa3;
    border-radius: 4px;
    color: #fff;
  }