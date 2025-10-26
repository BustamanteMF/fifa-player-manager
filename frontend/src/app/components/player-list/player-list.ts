import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Player } from '../../services/player';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './player-list.html',
  styleUrls: ['./player-list.scss']
})
export class PlayerListComponent implements OnInit {
  filterForm: FormGroup;
  players: any[] = [];
  page = 1;
  totalPages = 1;
  total = 0;
  loading = false;
  limit = 10;

  constructor(private fb: FormBuilder, private playerService: Player) {
    this.filterForm = this.fb.group({
      long_name: [''],
      club_name: [''],
      player_positions: [''],
      page: [1],
      limit: [this.limit]
    });
  }

  ngOnInit() {
    this.load();
    this.filterForm.valueChanges.pipe(debounceTime(350)).subscribe(() => {
      // resetear a primera página cuando cambian filtros
      this.filterForm.patchValue({ page: 1 }, { emitEvent: false });
      this.load();
    });
  }

  onSubmit() {
    this.filterForm.patchValue({ page: 1 });
    this.load();
  }

  load() {
    const filters = { ...this.filterForm.value };
    this.loading = true;
    this.playerService.getPlayers(filters).subscribe({
      next: (res: any) => {
        this.players = res.rows || [];
        this.total = res.count || 0;
        this.page = res.page || Number(this.filterForm.value.page) || 1;
        this.totalPages = res.totalPages || 1;
        this.limit = Number(this.filterForm.value.limit) || this.limit;
        this.loading = false;
      },
      error: (err) => {
        console.error('Players load error', err);
        this.loading = false;
      }
    });
  }

  changePage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.filterForm.patchValue({ page: p }, { emitEvent: false });
    this.load();
  }

  get currentPage() {
    return this.page;
  }

  downloadCsv() {
    // descarga simple; si tu servicio tiene método para esto, reemplazar
    const params = new URLSearchParams();
    const fv = this.filterForm.value;
    Object.keys(fv).forEach(k => {
      const v = fv[k];
      if (v !== null && v !== undefined && v !== '') params.set(k, String(v));
    });
    const url = `http://localhost:3000/api/players/download?${params.toString()}`;
    window.open(url, '_blank');
  }
}
