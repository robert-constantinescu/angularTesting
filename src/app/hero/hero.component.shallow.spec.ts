// --source-map=false


import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HeroComponent} from './hero.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {By} from '@angular/platform-browser';

describe('HeroComponent (shallow tests)', () => {

  /**
   *   A 'fixture' is a wrapper of the created component with some extra features
   */
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeroComponent],
      /**
       * This NO_ERRORS_SCHEMA will tell Angular to IGNORE unknown HTML attributes and elements(e.g. If you use routing module in your module)
       */
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(HeroComponent);
  })

  it('should have the correct hero', () => {
    fixture.componentInstance.hero = {id: 1, name: 'SuperDude', strength: 8};

    expect(fixture.componentInstance.hero.name).toEqual('SuperDude')
  })

  it('should render the hero name in an anchor<a> tag', () => {
    fixture.componentInstance.hero = {id: 1, name: 'SuperDude', strength: 8};
    fixture.detectChanges();
    /**
     * the below syntax will select the <a> tag and then the text from the tag
     *     fixture.nativeElement.querySelector('a').textContent
     *
     * This tells Angular to run CHANGE DETECTION and update bindings that may exists on the component
     *    fixture.detectChanges();
     *
     * Without fixture.detectChanges(); the test will fail because the inside of the <a> tag will not be updated
     *
     * the debug element can select an HTML element/attribute using DOM or Jquery syntax(google more)
     *     fixture.debugElement.query(By.css('a'))
     *
     * it can also be used if we want to know TO WHICH COMPONENT does A SPECIFIC ELEMENT BELONG
     *    fixture.debugElement.query(By.css('a')).componentInstance
     *
     */
    let debEl = fixture.debugElement.query(By.css('a'))

    expect(debEl.nativeElement.textContent).toContain('SuperDude')

    // expect(fixture.nativeElement.querySelector('a').textContent).toContain('SuperDude')
  })
})
