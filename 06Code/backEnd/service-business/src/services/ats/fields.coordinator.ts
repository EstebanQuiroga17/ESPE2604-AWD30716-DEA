import { CompraMapper } from './mappers/compras.mapper';
import { VentaMapper } from './mappers/ventas.mapper';
import { ExportacionMapper } from './mappers/exportaciones.mapper';
import { AnuladoMapper } from './mappers/anulados.mapper';

export type AtsFlag = 'compras' | 'ventas' | 'exportaciones' | 'anulados';

export class FieldsCoordinator {
  public mapJsons(jsons: any[], flag: AtsFlag): any[] {
    const mappedResults: any[] = [];
    
    let mapper: any;
    switch (flag) {
      case 'compras':
        mapper = new CompraMapper();
        break;
      case 'ventas':
        mapper = new VentaMapper();
        break;
      case 'exportaciones':
        mapper = new ExportacionMapper();
        break;
      case 'anulados':
        mapper = new AnuladoMapper();
        break;
      default:
        throw new Error(`Unsupported ATS flag: ${flag}`);
    }

    for (const json of jsons) {
      const keys = Object.keys(json).filter(k => k !== '?xml');
      const rootKey = keys[0];
      const data = rootKey ? json[rootKey] : json;
      
      if (!data) continue;

      try {
        const mapped = mapper.map(data);
        mappedResults.push(mapped);
      } catch (error) {
        console.error(`Error mapping JSON with flag ${flag}:`, error);
      }
    }

    return mappedResults;
  }
}
