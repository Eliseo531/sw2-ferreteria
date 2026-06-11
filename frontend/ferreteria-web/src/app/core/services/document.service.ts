import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { HttpClient } from '@angular/common/http';

const DOCUMENTS_QUERY = gql`
  query Documents {
    documents {
      idDocumento
      idProducto
      idProveedor
      nombre
      tipoDocumento
      urlArchivo
      fechaVencimiento
      estado
    }
  }
`;

const CREATE_DOCUMENT_MUTATION = gql`
  mutation CreateDocument($input: CreateDocumentInput!) {
    createDocument(input: $input) {
      idDocumento
      nombre
      tipoDocumento
      urlArchivo
      estado
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private apollo = inject(Apollo);
  private http = inject(HttpClient);

  private documentApiUrl = 'http://localhost:8003/documents';

  getDocuments() {
    return this.apollo.watchQuery<any>({
      query: DOCUMENTS_QUERY,
      fetchPolicy: 'network-only',
    }).valueChanges;
  }

  createDocument(input: any) {
    return this.apollo.mutate<any>({
      mutation: CREATE_DOCUMENT_MUTATION,
      variables: { input },
    });
  }

  uploadFile(file: File, documentType: string, relatedType: string, relatedId: number) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);
    formData.append('related_type', relatedType);
    formData.append('related_id', String(relatedId));

    return this.http.post<any>(`${this.documentApiUrl}/upload`, formData);
  }

  getDocumentsByRelated(relatedType: string, relatedId: number) {
    return this.http.get<any>(`${this.documentApiUrl}/related/${relatedType}/${relatedId}`);
  }
}
