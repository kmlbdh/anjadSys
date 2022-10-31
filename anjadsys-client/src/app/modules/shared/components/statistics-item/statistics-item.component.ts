import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-statistics-item',
  templateUrl: './statistics-item.component.html',
  styleUrls: ['./statistics-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticsItemComponent implements OnInit {

  @Input() item!:{id: number, key: string, svgIcon: string, statistics: number};
  svgIcon!: SafeHtml;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.svgIcon = this.sanitizer.bypassSecurityTrustHtml(this.item.svgIcon);
  }

}
