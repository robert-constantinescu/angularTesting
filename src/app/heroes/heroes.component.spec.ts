import {HeroesComponent} from './heroes.component';
import {of} from 'rxjs';

describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let HEROES;
  let mockHeroService;

  beforeEach(() => {
    HEROES = [
      {id: 1, name: 'SpiderDude', strength: 8},
      {id: 2, name: 'Joker', strength: 24},
      {id: 3, name: 'Cat Woman', strength: 55},
    ]

    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero'])

    component = new HeroesComponent(mockHeroService);
  })

  describe('delete', () => {
    it('should delete the indicated hero from heroes list', () => {
      /**
       *  The delete method from the HeroService is returning an Observable, because of that, we also need that our deleteHero method should
       *  also return an Obsevable.
       *
       *  deleteHero is a MOCK method of the delete method from the HeroService
       */
      mockHeroService.deleteHero.and.returnValue(of(true))
      component.heroes = HEROES;

      component.deleteHeroHandler(HEROES[2]);

      expect(component.heroes.length).toBe(2);
    })

    it('should call deleteHero', () => {
      mockHeroService.deleteHero.and.returnValue(of(true))
      component.heroes = HEROES;

      component.deleteHeroHandler(HEROES[2]);

      expect(mockHeroService.deleteHero).toHaveBeenCalled();
    })


    it('should call deleteHero with parameter', () => {
      mockHeroService.deleteHero.and.returnValue(of(true))
      component.heroes = HEROES;

      component.deleteHeroHandler(HEROES[2]);

      expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[2]);
    })

  })

})
