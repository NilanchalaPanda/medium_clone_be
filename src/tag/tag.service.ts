import { Injectable } from '@nestjs/common';

@Injectable()
export class TagService {
  getTags(): { id: number; name: string }[] {
    return [
      { id: 1, name: 'Tag1' },
      { id: 2, name: 'Tag2' },
      { id: 3, name: 'Tag3' },
    ];
  }
}
