const { getRange, getLetterRange } = require('./array-util');
const { removeChildren, createTR, createTH, createTD } = require('./dom-util');

class TableView {
  constructor(model) {
    this.model = model;
  }

  init() {
    this.initDomReferences();
    this.initCurrentCell();
    this.renderTable();
    this.attachEventHandlers();
  }

  initDomReferences() {
    this.headerRowEl = document.querySelector('THEAD TR');
    this.sheetBodyEl = document.querySelector('TBODY');
    this.formulaBarEl = document.querySelector('#formula-bar');
    this.summationBarEl = document.querySelector('TFOOT');
  }

  initCurrentCell() {
    this.currentCellLocation = { col: 0, row: 0 };
    this.renderFormulaBar();
  }

  normalizeValueForRendering(value) {
    return value || '';
  }
  
  renderFormulaBar() {
    const currentCellValue = this.model.getValue(this.currentCellLocation);
    this.formulaBarEl.value = this.normalizeValueForRendering(currentCellValue);
    this.formulaBarEl.focus();
  }
  

  renderTable() {
    this.renderTableHeader();
    this.renderTableBody();
    this.renderSummationBar();
  }

  renderTableHeader() {
    removeChildren(this.headerRowEl);
    getLetterRange('A', this.model.numCols)
      .map(colLabel => createTH(colLabel))
      .forEach(th => this.headerRowEl.appendChild(th));
  }

  isCurrentCell(col, row) {
    return this.currentCellLocation.col === col &&
      this.currentCellLocation.row === row;
  }
 
  renderTableBody() {
    const fragment = document.createDocumentFragment();
    for (let row = 0; row < this.model.numRows; row++) {
      const tr = createTR();
      for (let col = 0; col < this.model.numCols; col++) {
        const position = {col: col, row: row};
        const value = this.model.getValue(position);
        const td = createTD(value);

        if (this.isCurrentCell(col, row)) {
          td.className = 'current-cell';
        }
        
        tr.appendChild(td);
      }
      fragment.appendChild(tr);
    }
    removeChildren(this.sheetBodyEl);
    this.sheetBodyEl.appendChild(fragment);
  }

  renderSummationBar() {
    removeChildren(this.summationBarEl);
    getRange(0, this.model.numCols) 
      .map( column => createTD( this.sumColumn(column) ))
      .forEach(td => this.summationBarEl.appendChild(td));
  }

  getColumnPositions(column) {
    return Object.keys(this.model.data)
      .map(position => position.match(/^(\d+):(\d+)/).slice(1))
      .filter(rowAndColPair => parseInt(rowAndColPair[0]) === column)
      .map(matchingPosition =>
           ({col: matchingPosition[0], row: matchingPosition[1]}));
  }
  
  sumColumn(column) {
    return this.getColumnPositions(column)
      .map(position => this.model.getValue(position))
      .map(value => parseInt(value, 10))
      .filter(value => !isNaN(value))
      .reduce( ((sum, value) => sum + value), 0 );
  }
  
  attachEventHandlers() {
    this.sheetBodyEl.addEventListener('click', this.handleSheetClick.bind(this));
    this.formulaBarEl.addEventListener('keyup', this.handleFormulaBarChange.bind(this));
  }
  
  handleFormulaBarChange(evt) {
    const value = this.formulaBarEl.value;
    this.model.setValue(this.currentCellLocation, value);
    this.renderTableBody();
    this.renderSummationBar();
  }
  
  handleSheetClick(evt) {
    const col = evt.target.cellIndex;
    const row = evt.target.parentElement.rowIndex - 1;

    this.currentCellLocation = { col: col, row: row };
    this.renderTableBody();
    this.renderFormulaBar();
    this.renderSummationBar();
  }
  
}

module.exports = TableView;
