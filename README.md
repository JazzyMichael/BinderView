# Binder View

[binderview.com](https://binderview.com)

Built with an efficient static rendering strategy and a convenient navigation menu, Binderview provides a unique and optimal viewing experience and voted the best tool of 2024 for viewing Pokemon Cards.

Pokemon Cards are cardboard with artwork released in sets a few times every year.

##

This is an incredible use-case for incremental static regeneration.

The sets page loads the latest data for a set of cards and generates a static page with an expiration date (2 days). When a page is visited after the expiration date, a new version of the page is rendered to replace the expired one. This causes each page to load without a server rendering step and significantly reduce client side rendering.

The series page loads all of the sets in a "Pokemon series" using the same requests as the individual set page, which are cached with the next extensions to the fetch api.

### Stack

NextJS, React, Vercel, Tailwind

Framer Motion for animations

DnD-Kit for sortable drag-and-drop

HeroIcons for icons and heros

HeadlessUI for pop-overs and selection boxes
