const { createTR,
	createTH,
	createTD,
	removeChildren } = require ('../dom-util.js');

describe ('dom-util', () => {

  describe('DOM creation functions', () => {
    describe('createTR()', () => {
      it('produces valid TR element', () => {
	const el = createTR();
	expect(el.tagName).toBe('TR');
      });
    });

    it('sets the text of the TR', () => {
      const text = 'Oh, that\'s just great! Well, game over, man!';
      const el = createTR(text);
      expect(el.textContent).toEqual(text);
    });
    
    describe('createTH()', () => {
      it('produces valid TH element', () => {
	const el = createTH();
	expect(el.tagName).toBe('TH');
      });
    });

      describe('createTD()', () => {
      it('produces valid TD element', () => {
	const el = createTD();
	expect(el.tagName).toBe('TD');
      });
    });

  });
  
  describe('removeChildren()', () => {
    it('removes one child', () => {
      // set up initial state
      const parent = document.createElement('DIV');
      const child = document.createElement('STRONG');
      parent.appendChild(child);

      // inspect initial state
      expect(parent.childNodes.length).toBe(1);
      expect(parent.childNodes[0]).toBe(child);

      // execute code under test
      removeChildren(parent);

      // inspect resulting state
      expect(parent.childNodes.length).toBe(0);
    });
  });
});

