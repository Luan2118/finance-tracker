import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {menuIcon} from '../../../../../frontend/script/utils/menuIcon.js';
import {screen} from '@testing-library/dom';
import {userEvent} from '@testing-library/user-event';



describe('menuIcon', () => {
  it('should toggle sidebar and menu icon on click', async () => {
    document.body.innerHTML = `
    <button type="button" id="menu-icon-box" class="menu-icon-btn" aria-label="Open menu" aria-expanded="false" aria-controls="sidebar"><img class="menu-icon js-menu-icon" src="icons/menu-icon.png" alt=""></button>
    <aside id="sidebar" class="sidebar" role="navigation"></aside>
    `

    menuIcon();

    const user = userEvent.setup();

    const menuIconBox = screen.getByRole('button', {name: /open menu/i})
    const menuIMG = document.querySelector('.js-menu-icon')
    
    const sidebar = screen.getByRole('navigation')
    await user.click(menuIconBox)

    expect(sidebar).toHaveClass('is-open');
    expect(menuIconBox).toHaveAttribute('aria-expanded', 'true');
    expect(menuIconBox).toHaveAttribute('aria-label', 'Open menu');
    expect(menuIMG).toHaveAttribute('src', 'icons/menu-close-icon.png');

    await user.click(menuIconBox);

    expect(sidebar).not.toHaveClass('is-open');
    expect(menuIconBox).toHaveAttribute('aria-expanded', 'false');
    expect(menuIconBox).toHaveAttribute('aria-label', 'Close menu');
    expect(menuIMG).toHaveAttribute('src', 'icons/menu-icon.png');
  })
})