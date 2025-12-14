import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductService, Product } from '../../services/product.service';
import { VentaService } from '../../services/venta.service';
import { Subscription } from 'rxjs';

interface VentaItem {
  productId: number | null;
  quantity: number;
}

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.scss']
})
export class VentaComponent implements OnInit, OnDestroy {

  productos: Product[] = [];
  clienteNombre = '';
  clienteTelefono = '';

  items: VentaItem[] = [
    { productId: null, quantity: 1 }
  ];

  mensajeError = '';
  mensajeOk = '';

  // 🧾 FACTURA
  ventaId: number | null = null;

  private subs: Subscription[] = [];

  constructor(
    private productService: ProductService,
    private ventaService: VentaService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  cargarProductos(): void {
    const s = this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.productos = data;
      },
      error: (err: any) => {
        console.error('Error cargando productos', err);
        this.mensajeError = 'Error cargando productos';
      }
    });
    this.subs.push(s);
  }

  agregarItem(): void {
    this.items.push({ productId: null, quantity: 1 });
  }

  quitarItem(i: number): void {
    if (this.items.length > 1) {
      this.items.splice(i, 1);
    }
  }

  obtenerProducto(id: number | null): Product | undefined {
    return this.productos.find(p => p.id === id);
  }

  subtotal(item: VentaItem): number {
    const p = this.obtenerProducto(item.productId);
    return p ? p.precio * (item.quantity || 0) : 0;
  }

  total(): number {
    return this.items.reduce((sum, it) => sum + this.subtotal(it), 0);
  }

  registrar(): void {
    this.mensajeError = '';
    this.mensajeOk = '';
    this.ventaId = null;

    const items = this.items
      .filter(it => it.productId !== null && it.quantity > 0)
      .map(it => ({
        id_producto: it.productId,
        cantidad: it.quantity
      }));

    if (!this.clienteNombre || items.length === 0) {
      this.mensajeError = 'Debe ingresar cliente y productos.';
      return;
    }

    const datos = {
      cliente: {
        nombre: this.clienteNombre,
        telefono: this.clienteTelefono
      },
      items
    };

    const s = this.ventaService.crearVenta(datos).subscribe({
      next: (res: any) => {
        this.mensajeOk = 'Venta registrada correctamente';
        this.ventaId = res.id_venta || res.id;
      },
      error: (err: any) => {
        console.error(err);
        this.mensajeError = err.error?.message || 'Error en la venta';
      }
    });

    this.subs.push(s);
  }

  verFactura(): void {
    if (!this.ventaId) return;

    window.open(
      `http://localhost:3000/api/ventas/${this.ventaId}/factura`,
      '_blank'
    );
  }
}
