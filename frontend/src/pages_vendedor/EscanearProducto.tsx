import { useMemo, useRef, useState } from 'react'
import { useEffect } from 'react'
import Quagga from '@ericblade/quagga2'
import Header from '../components/VendedorHeader'
import Icon from '../components/Icon'
import Sidebar from '../components/VendedorSidebar'

type Product = {
  code: string
  name: string
  category: string
  price: number
  stock: number
  unit: string
}

type SaleLine = Product & {
  quantity: number
}

const mockProducts: Product[] = [
  {
    code: '7501001234567',
    name: 'Fertilizante organico 25 kg',
    category: 'Fertilizantes',
    price: 28.5,
    stock: 12,
    unit: 'saco',
  },
  {
    code: '7861006801090',
    name: 'Café oro 48g',
    category: 'Comestibles',
    price: 16.75,
    stock: 8,
    unit: 'funda',
  },
  {
    code: '7705550011223',
    name: 'Insecticida foliar 1 L',
    category: 'Control agricola',
    price: 12.9,
    stock: 21,
    unit: 'botella',
  },
]

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-EC', {
    currency: 'USD',
    style: 'currency',
  }).format(value)
}

function EscanearProducto() {
  const scannerRef = useRef<HTMLDivElement | null>(null)
  const lastDetectedCode = useRef('')
  const [isScanning, setIsScanning] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [saleLines, setSaleLines] = useState<SaleLine[]>([])
  const [message, setMessage] = useState('Escanea un codigo o busca un producto de prueba.')

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return mockProducts
    }

    return mockProducts.filter((product) => {
      return (
        product.code.includes(normalizedQuery) ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery)
      )
    })
  }, [query])

  const saleTotal = saleLines.reduce((total, line) => total + line.price * line.quantity, 0)

  const selectProductByCode = (code: string) => {
    const product = mockProducts.find((item) => item.code === code)

    if (!product) {
      setSelectedProduct(null)
      setMessage(`No encontramos un producto mock con el codigo ${code}.`)
      return
    }

    setSelectedProduct(product)
    setQuery(product.code)
    setMessage(`Producto encontrado: ${product.name}.`)
  }

  const addProductToSale = (product: Product) => {
    setSaleLines((currentLines) => {
      const existingLine = currentLines.find((line) => line.code === product.code)

      if (existingLine) {
        return currentLines.map((line) =>
          line.code === product.code ? { ...line, quantity: Math.min(line.quantity + 1, product.stock) } : line,
        )
      }

      return [...currentLines, { ...product, quantity: 1 }]
    })

    setMessage(`${product.name} agregado al registro de venta.`)
  }

  const updateQuantity = (code: string, quantity: number) => {
    setSaleLines((currentLines) =>
      currentLines
        .map((line) => (line.code === code ? { ...line, quantity: Math.min(Math.max(quantity, 1), line.stock) } : line))
        .filter((line) => line.quantity > 0),
    )
  }

  const registerMockSale = () => {
    if (!saleLines.length) {
      setMessage('Agrega al menos un producto antes de registrar la venta.')
      return
    }

    setSaleLines([])
    setSelectedProduct(null)
    setQuery('')
    setMessage(`Venta mock registrada por ${formatCurrency(saleTotal)}.`)
  }

  useEffect(() => {
    if (!isScanning || !scannerRef.current) {
      return undefined
    }

    let cancelled = false

    const handleDetected = (result: { codeResult?: { code?: string } }) => {
      const code = result.codeResult?.code

      if (!code || code === lastDetectedCode.current) {
        return
      }

      lastDetectedCode.current = code
      selectProductByCode(code)
    }

    Quagga.init(
      {
        decoder: {
          readers: ['ean_reader', 'ean_8_reader', 'code_128_reader', 'upc_reader'],
        },
        inputStream: {
          constraints: {
            facingMode: 'environment',
          },
          target: scannerRef.current,
          type: 'LiveStream',
        },
        locate: true,
      },
      (error: Error | null) => {
        if (cancelled) {
          return
        }

        if (error) {
          setIsScanning(false)
          setMessage('No se pudo iniciar la camara. Puedes usar los mocks de prueba.')
          return
        }

        Quagga.start()
        setMessage('Camara activa. Acerca el codigo de barras al recuadro.')
      },
    )

    Quagga.onDetected(handleDetected)

    return () => {
      cancelled = true
      Quagga.offDetected(handleDetected)
      Quagga.stop()
      lastDetectedCode.current = ''
    }
  }, [isScanning])

  return (
    <main className="seller-home" id="escanear">
      <Sidebar activeHref="#escanear" userName="Vendedor" userDetail="Junio 19, 2026" />

      <section className="workspace">
        <Header
          eyebrow="Inventario"
          title="Escanear producto"
          searchLabel="Buscar codigo o producto"
          onScan={() => setIsScanning((current) => !current)}
          onNewSale={registerMockSale}
        />

        <section className="scanner-layout">
          <article className="panel scanner-panel" aria-label="Escaner de codigos">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Camara</p>
                <h2>Lectura con Quagga</h2>
              </div>
              <button
                className={isScanning ? 'button secondary' : 'button primary'}
                type="button"
                onClick={() => setIsScanning((current) => !current)}
              >
                <Icon name="scan" />
                {isScanning ? 'Detener escaner' : 'Iniciar escaner'}
              </button>
            </div>

            <div className={isScanning ? 'scanner-frame is-active' : 'scanner-frame'} ref={scannerRef}>
              {!isScanning && (
                <div className="scanner-placeholder">
                  <Icon name="scan" />
                  <strong>Escaner en espera</strong>
                  <span>Activa la camara o usa un codigo mock.</span>
                </div>
              )}
            </div>

            <p className="scanner-message">{message}</p>

            <div className="mock-code-list" aria-label="Codigos mock">
              {mockProducts.map((product) => (
                <button className="mock-code-button" key={product.code} type="button" onClick={() => selectProductByCode(product.code)}>
                  <span>{product.code}</span>
                  <strong>{product.name}</strong>
                </button>
              ))}
            </div>
          </article>

          <article className="panel product-lookup-panel" aria-label="Busqueda de productos">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Busqueda</p>
                <h2>Productos de prueba</h2>
              </div>
              <Icon name="inventory" />
            </div>

            <label className="lookup-field">
              Producto o codigo
              <input
                type="search"
                placeholder="Ej. 7501001234567"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>

            <div className="product-result-list">
              {filteredProducts.map((product) => (
                <button
                  className={selectedProduct?.code === product.code ? 'product-result-card is-selected' : 'product-result-card'}
                  key={product.code}
                  type="button"
                  onClick={() => {
                    setSelectedProduct(product)
                    setMessage(`Producto seleccionado: ${product.name}.`)
                  }}
                >
                  <div>
                    <strong>{product.name}</strong>
                    <span>{product.code}</span>
                  </div>
                  <small>{formatCurrency(product.price)}</small>
                </button>
              ))}
            </div>
          </article>

          <article className="panel selected-product-panel" aria-label="Producto seleccionado">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Resultado</p>
                <h2>{selectedProduct ? selectedProduct.name : 'Sin producto'}</h2>
              </div>
              <Icon name="eye" />
            </div>

            {selectedProduct ? (
              <div className="selected-product-card">
                <div className="selected-product-meta">
                  <span>Codigo</span>
                  <strong>{selectedProduct.code}</strong>
                </div>
                <div className="selected-product-meta">
                  <span>Categoria</span>
                  <strong>{selectedProduct.category}</strong>
                </div>
                <div className="selected-product-meta">
                  <span>Precio</span>
                  <strong>{formatCurrency(selectedProduct.price)}</strong>
                </div>
                <div className="selected-product-meta">
                  <span>Stock</span>
                  <strong>
                    {selectedProduct.stock} {selectedProduct.unit}
                  </strong>
                </div>

                <button className="button primary full-width-button" type="button" onClick={() => addProductToSale(selectedProduct)}>
                  <Icon name="plus" />
                  Agregar a venta
                </button>
              </div>
            ) : (
              <p className="empty-state">Selecciona un producto o escanea un codigo para ver el detalle.</p>
            )}
          </article>

          <article className="panel mock-sale-panel" aria-label="Registro de venta mock">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Registro</p>
                <h2>Venta mock</h2>
              </div>
              <button className="text-button" type="button" onClick={registerMockSale}>
                Registrar
              </button>
            </div>

            <div className="mock-sale-lines">
              {saleLines.length ? (
                saleLines.map((line) => (
                  <div className="mock-sale-line" key={line.code}>
                    <div>
                      <strong>{line.name}</strong>
                      <span>{formatCurrency(line.price)} c/u</span>
                    </div>
                    <input
                      aria-label={`Cantidad de ${line.name}`}
                      min="1"
                      max={line.stock}
                      type="number"
                      value={line.quantity}
                      onChange={(event) => updateQuantity(line.code, Number(event.target.value))}
                    />
                    <strong>{formatCurrency(line.price * line.quantity)}</strong>
                  </div>
                ))
              ) : (
                <p className="empty-state">Aun no hay productos en la venta.</p>
              )}
            </div>

            <div className="mock-sale-total">
              <span>Total</span>
              <strong>{formatCurrency(saleTotal)}</strong>
            </div>
          </article>
        </section>
      </section>
    </main>
  )
}

export default EscanearProducto
