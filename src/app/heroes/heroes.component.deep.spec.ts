import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HeroesComponent} from './heroes.component';
import {HeroService} from '../hero.service';
import {Component, Directive, EventEmitter, Input, NO_ERRORS_SCHEMA, Output} from '@angular/core';
import {of} from 'rxjs';
import {Hero} from '../hero';
import {By} from '@angular/platform-browser';
import {HeroComponent} from '../hero/hero.component';

@Directive({
  selector: '[routerLink]',
  host: {'(click)': 'onClick()'}
})
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  onClick() {
    this.navigatedTo = this.linkParams;
  }

}



describe('HeroesComponent (shallow test)',
  () => {
    let fixture: ComponentFixture<HeroesComponent>
    let mockHeroService;
    let HEROES;


    beforeEach(() => {
      mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero'])

      HEROES = [
        {id: 1, name: 'SpiderDude', strength: 8},
        {id: 2, name: 'Joker', strength: 24},
        {id: 3, name: 'Cat Woman', strength: 55},
      ]

      TestBed.configureTestingModule({
        declarations: [
          HeroesComponent,
          HeroComponent,
          RouterLinkDirectiveStub
        ],
        providers: [
          /**
           * When anybody ask for HeroService user mockHeroService
           */
          {provide: HeroService, useValue: mockHeroService}
        ],
        // schemas: [NO_ERRORS_SCHEMA]
      })

      fixture = TestBed.createComponent(HeroesComponent);

    })

    it('should render each hero as a HeroComponent', () => {
      mockHeroService.getHeroes.and.returnValue(of(HEROES));
      fixture.detectChanges();

      const heroComponentsDebugEl = fixture.debugElement.queryAll(By.directive(HeroComponent))
      /**
       * Basically here we are saying that we expect to have 3 <app-hero> elements created in the HeroesComponent html
       */
      expect(heroComponentsDebugEl.length).toBe(3);

      /**
       * here we say that the first <app-hero> generated in HeroesComponent, to have a property called 'hero' that has the 'name' = SpiderDude
       */
      expect(heroComponentsDebugEl[0].componentInstance.hero.name).toEqual('SpiderDude')

      for (let i=0; i < 3; i++) {
        console.log(heroComponentsDebugEl[i].componentInstance)
        expect(heroComponentsDebugEl[i].componentInstance.hero).toEqual(HEROES[i]);
      }
    })

    it(`should call heroService.deleteHero when the HeroComponent's delete BUTTON IS CLICKED `, () => {
      /**
       * Try to reverse engineer what you have written here because it's the explication is too long.
       * Or watch Plurlasight -> Unit Testing In angular -> module 6 -> lessson2
       *
       */

      //here we tell to listen that the 'deleteHeroHandler' method of the fixture was called
      spyOn(fixture.componentInstance, 'deleteHeroHandler')
      mockHeroService.getHeroes.and.returnValue(of(HEROES));
      fixture.detectChanges();

      //Here we want to find all <app-hero> from the fixture(which is HeroesComponent, which has a list of <app-hero> in it's template )
      const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent))

      /**
       *      here we tell to find by css a button and then trigger a 'click' event on the button. stopPropagation i have no idea why we call it
       *  but it is also called from the onDeleteClick() method from HeroComponent
       */
      heroComponents[0].query(By.css('button')).triggerEventHandler('click', {stopPropagation: () => {}})

      //here we tell that we expect the delete method of the fixture(HeroesComponent) to have been called with the FIRST hero of the list. Triggered one line above
      expect(fixture.componentInstance.deleteHeroHandler).toHaveBeenCalledWith(HEROES[0]);
    })


    it(`should call heroService.deleteHero when the HeroComponent's a delete EVENT is TRIGGERED `, () => {
      /**
       * Try to reverse engineer what you have written here because it's the explication is too long.
       * Or watch Plurlasight -> Unit Testing In angular -> module 6 -> lessson3
       *
       */

      //here we tell to listen that the 'deleteHeroHandler' method of the fixture was called
      spyOn(fixture.componentInstance, 'deleteHeroHandler')
      mockHeroService.getHeroes.and.returnValue(of(HEROES));
      fixture.detectChanges();

      //Here we want to find all <app-hero> from the fixture(which is HeroesComponent, which has a list of <app-hero> in it's template )
      const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

      //rather than clicking the button, we tell the component to raise the event. This can also come in handy for BehaviourSubjects
      (<HeroComponent>heroComponents[0].componentInstance).delete.emit(undefined);
      /**
       *    - the below achieve the same things as the above but in a different way
       *     ~~~    heroComponents[0].triggerEventHandler('delete', null);   ~~~
       *   - we just tell the debug element to trigger an event
       */


      //here we tell that we expect the delete method of the fixture(HeroesComponent) to have been called with the FIRST hero of the list. Triggered one line above
      expect(fixture.componentInstance.deleteHeroHandler).toHaveBeenCalledWith(HEROES[0]);
    })


    it(`should add a new hero to the hero list when the ADD BUTTON is CLICKED `, () => {
      mockHeroService.getHeroes.and.returnValue(of(HEROES));
      fixture.detectChanges();

      const heroName = 'Legion Man';

      mockHeroService.addHero.and.returnValue(of({id: 5, name: heroName, strength: 21}));

      const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
      const addButton = fixture.debugElement.queryAll(By.css('button'))[0];

      inputElement.value = heroName;
      addButton.triggerEventHandler('click', null);

      fixture.detectChanges();

      const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;

      expect(heroText).toContain(heroName);

    });

    it(`should have the correct route for the first hero `, () => {
      mockHeroService.getHeroes.and.returnValue(of(HEROES));
      fixture.detectChanges();
      const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

      let routerLink = heroComponents[0]
        .query(By.directive(RouterLinkDirectiveStub))
        .injector.get(RouterLinkDirectiveStub);

      heroComponents[0].query(By.css('a')).triggerEventHandler('click', null);

      expect(routerLink.navigatedTo).toBe('/detail/1');

    })



})
