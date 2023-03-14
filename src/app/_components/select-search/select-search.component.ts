import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Item } from './item.model';

@Component({
  selector: 'app-select-search',
  templateUrl: './select-search.component.html',
  styleUrls: ['./select-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectSearchComponent {
  _items: Item[] = [];

  @Input() placeholder?: string;
  @Input() showSearch = true;
  @Input() showStatus = true;
  @Input() showError = false;
  @Input() selectedItem?: Item;
  @Output() itemChange = new EventEmitter<Item>();

  @Input('items')
  set items(items: Item[]) {
    this._items = items;
    this._items.map(item => {
      item.visible = item.visible || true;
    });
    this.filtered = [...this._items];
  }

  filtered: Item[] = [];
  item?: Item;
  showDropdownMenu = false

  searchText = '';

  get isEmpty(): boolean {
    return this.filtered.filter(i => i.visible).length === 0;
  }

  searchItem() {
    const search = this.searchText.toLowerCase();
    if (!search) {
      this.filtered = [...this._items];
      return;
    }
    this.filtered = this._items.filter(i => i.name.toLowerCase().indexOf(search) !== -1);
  }

  trackById(item: Item): number {
    return item.id;
  }

  onChange(item: Item): void {
    this.selectedItem = item
    this.item = item;
    this.showDropdownMenu = false
    this.itemChange.emit(item);
  }

  toggleDropdown() {
    this.showDropdownMenu = !this.showDropdownMenu
  }
}
