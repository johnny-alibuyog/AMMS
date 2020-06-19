import { appConfig } from '../../app-config';
import { autoinject, bindable, bindingMode, customElement, computedFrom } from 'aurelia-framework'

@autoinject()
@customElement('pagination')
export class Pagination {

  @bindable({ defaultBindingMode: bindingMode.twoWay })
  public currentPage: number;

  @bindable({ defaultBindingMode: bindingMode.twoWay })
  public pageSize: number;

  @bindable({ defaultBindingMode: bindingMode.twoWay })
  public totalItems: number;

  public totalPages: number;

  public pages: Page[] = [];

  private _element: Element;

  private _config: PageConfig = {};

  constructor(element: Element) {
    this._element = element;

    var defaultIfNull = (value: any, alternative: any) => value != null ? value : alternative;

    this._config = {
      maxSize: defaultIfNull(appConfig.page.maxSize, 5),
      pageSize: defaultIfNull(appConfig.page.pageSize, 10),
      boundaryLinks: defaultIfNull(appConfig.page.boundaryLinks, true),
      directionLinks: defaultIfNull(appConfig.page.directionLinks, true),
      firstText: defaultIfNull(appConfig.page.firstText, '<<'),
      previousText: defaultIfNull(appConfig.page.previousText, '<'),
      nextText: defaultIfNull(appConfig.page.nextText, '>'),
      lastText: defaultIfNull(appConfig.page.lastText, '>>'),
      rotate: defaultIfNull(appConfig.page.rotate, false)
    };

    this.pageSize = this._config.pageSize;
  }

  public attached(): void {
    this.buildPages();
    window.addEventListener('keydown', this.handleKeyInput, false);
  }

  public dettached(): void {
    window.removeEventListener('keydown', this.handleKeyInput);
  }

  public handleKeyInput = (event: KeyboardEvent) => {
    if (event.code === 'ArrowLeft' || event.code === 'ArrowUp') {
      if (event.ctrlKey && event.shiftKey) {
        this.selectFirst();
      }
      else if (event.ctrlKey) {
        this.selectPrevious();
      }
    }
    else if (event.code === 'ArrowRight' || event.code === 'ArrowDown') {
      if (event.ctrlKey && event.shiftKey) {
        this.selectLast();
      }
      else if (event.ctrlKey) {
        this.selectNext();
      }
    }
  }

  public currentPageChanged(): void {
    // just to validate if current page is still valid
    this.selectPage(this.currentPage);
    //this.buildPages();
  }

  public totalItemsChanged(): void {
    // just to validate if current page is still valid
    this.selectPage(this.currentPage);
    //this.buildPages();
  }

  public calculateTotalPages(): number {
    var totalPages = this.pageSize < 1 ? 1 : Math.ceil(this.totalItems / this.pageSize);
    totalPages = Math.max(totalPages || 0, 1);

    if (this.currentPage > totalPages)
      this.currentPage = totalPages;

    return totalPages;
  }

  public getText(key: string): string {
    return this._config[key + 'Text'];
  }

  public get directionLinks(): boolean {
    return this._config.directionLinks;
  }

  public get boundaryLinks(): boolean {
    return this._config.boundaryLinks;
  }

  @computedFrom('currentPage')
  public get noPrevious(): boolean {
    return this.currentPage === 1;
  }

  @computedFrom('currentPage', 'totalPage')
  public get noNext(): boolean {
    return this.currentPage === this.totalPages;
  }

  public selectFirst(): void {
    if (this.noPrevious) {
      return;
    }
    this.selectPage(1);
  }

  public selectPrevious(): void {
    if (this.noPrevious) {
      return;
    }
    this.selectPage(this.currentPage - 1);
  }

  public selectNext(): void {
    if (this.noNext) {
      return;
    }
    this.selectPage(this.currentPage + 1);
  }

  public selectLast(): void {
    if (this.noNext) {
      return;
    }
    this.selectPage(this.totalPages);
  }

  public selectPage(pageNumber: number) {
    if (pageNumber < 1)
      return;

    if (pageNumber > this.totalPages)
      return;

    this.currentPage = pageNumber;
    this.buildPages();

    var changeEvent = document.createEvent('CustomEvent');
    changeEvent.initCustomEvent('change', true, true, { pageNumber: pageNumber });
    this._element.dispatchEvent(changeEvent);
  }

  public buildPages(): void {
    // Clear pages
    this.pages = [];

    this.totalPages = this.calculateTotalPages();

    // Default page limits
    var startPage = 1;
    var endPage = this.totalPages;
    var isMaxSized = this._config.maxSize < this.totalPages;

    // recompute if maxSize
    if (isMaxSized) {
      if (this._config.rotate) {
        // Current page is displayed in the middle of the visible ones
        startPage = Math.max(this.currentPage - Math.floor(this._config.maxSize / 2), 1);
        endPage = startPage + this._config.maxSize - 1;

        // Adjust if limit is exceeded
        if (endPage > this.totalPages) {
          endPage = this.totalPages;
          startPage = endPage - this._config.maxSize + 1;
        }
      }
      else {
        // Visible pages are paginated with maxSize
        startPage = ((Math.ceil(this.currentPage / this._config.maxSize) - 1) * this._config.maxSize) + 1;

        // Adjust last page if limit is exceeded
        endPage = Math.min(startPage + this._config.maxSize - 1, this.totalPages);
      }
    }

    // Add page number links
    for (var pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
      var page = <Page>{
        isActive: pageNumber == this.currentPage,
        number: pageNumber,
        text: pageNumber.toString()
      };
      if (!this.pages.some(x => x.number === page.number)) {
        this.pages.push(page);
      }
    }

    // Add links to move between page sets
    if (isMaxSized && !this._config.rotate) {
      if (startPage > 1) {
        var previousPageSet = <Page>{
          isActive: false,
          number: startPage - 1,
          text: '...'
        };
        this.pages.unshift(previousPageSet);
      }

      if (endPage < this.totalPages) {
        var nextPageSet = <Page>{
          isActive: false,
          number: endPage + 1,
          text: '...'
        };
        this.pages.push(nextPageSet);
      }
    }
  }
}

export interface Page {
  isActive: boolean;
  number: number;
  text: string;
}

export interface PageConfig {
  maxSize?: number,
  pageSize?: number;
  boundaryLinks?: boolean;
  directionLinks?: boolean;
  firstText?: string;
  previousText?: string;
  nextText?: string;
  lastText?: string;
  rotate?: boolean;
}
