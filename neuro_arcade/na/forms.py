from django import forms
from django.contrib.auth.models import User
from .models import Publication, About
from django.forms import inlineformset_factory


class UserForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())

    class Meta:
        model = User
        fields = ('username', 'email', 'password')


class PublicationForm(forms.ModelForm):
    class Meta:
        model = Publication
        fields = ['title', 'author', 'link']


AboutPageFormSet = inlineformset_factory(About, Publication, form=PublicationForm, extra=1)


class AboutForm(forms.ModelForm):

    class Meta:
        model = About
        fields = ['description', 'image']

    def __init__(self, *args, **kwargs):
        super(AboutForm, self).__init__(*args, **kwargs)
        self.pub_formset = AboutPageFormSet(instance=self.instance)