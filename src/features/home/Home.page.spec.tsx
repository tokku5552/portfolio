import { render } from '@testing-library/react';
import Home, { particleStages } from './Home.page';

describe('Home', () => {
  let getContext: jest.SpyInstance;

  beforeEach(() => {
    getContext = jest
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue(null);
  });

  afterEach(() => {
    getContext.mockRestore();
  });

  it('renders a section for every particle stage id', () => {
    const { container } = render(<Home articles={[]} worksOgpImages={{}} />);
    for (const { id } of particleStages) {
      expect(container.querySelector(`#${id}`)).not.toBeNull();
    }
  });
});
