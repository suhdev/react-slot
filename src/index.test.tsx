import * as React from 'react';
import { render, cleanup, act } from '@testing-library/react';
import { SlotsContainer, Slot, SlotContent } from '.';

describe('react-slot', () => {
  describe('render content in slot when slots are created ahead of their content', () => {
    it('should render content in slots correctly', () => {
      const { getByTestId } = render(
        <SlotsContainer>
          <div className="container">
            <Slot name="test-1" />
            <div className="sub-container" data-testid="test-2">
              <Slot name="test-2" />
            </div>
            <div className="empty-box">
              Suhail
            </div>
            <div className="with-subslot">
              <div className="with-subslot" data-testid="test-3">
                <Slot name="test-3" />
              </div>
            </div>
          </div>
          <div className="actual-content">
            <div className="app-content">
              <SlotContent name="test-2">
                <div>TEST 1 CONTENT</div>
                <SlotContent name="test-3">
                  <div>TEST 2 CONTENT</div>
                </SlotContent>
              </SlotContent>
            </div>
          </div>
        </SlotsContainer>);

      expect(getByTestId('test-2').textContent).toEqual('TEST 1 CONTENT');
      expect(getByTestId('test-3').textContent).toEqual('TEST 2 CONTENT');
    });

  });

  describe('render content in slots when content is ready before slot', () => {
    it('should render content in slot when slot becomes available after the content', async () => {
      const TestBox = () => {
        const [view, setView] = React.useState(null);

        React.useEffect(
          () => {
            setTimeout(
              () => {
                setView(<Slot name="test-2" />);
              },
              250);
          },
          []);

        return view;
      };

      let getByTestId = null;

      act(() => {
        const { getByTestId: get } = render(
          <SlotsContainer>
            <div className="container">
              <Slot name="test-1" />
              <div className="sub-container" data-testid="test-2">
                <TestBox />
              </div>
              <div className="empty-box">
                Suhail
            </div>
              <div className="with-subslot">
                <div className="with-subslot" data-testid="test-3">
                  <Slot name="test-3" />
                </div>
              </div>
            </div>
            <div className="actual-content">
              <div className="app-content">
                <SlotContent name="test-2">
                  <div>TEST 1 CONTENT</div>
                  <SlotContent name="test-3">
                    <div>TEST 2 CONTENT</div>
                  </SlotContent>
                </SlotContent>
              </div>
            </div>
          </SlotsContainer>);

        getByTestId = get;
      });

      await new Promise(r => setTimeout(r, 300));

      expect(getByTestId('test-2').textContent).toEqual('TEST 1 CONTENT');
      expect(getByTestId('test-3').textContent).toEqual('TEST 2 CONTENT');
    });
  });
});
