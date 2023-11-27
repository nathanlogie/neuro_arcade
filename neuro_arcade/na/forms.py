from django import forms
from django.contrib.auth.models import User
from django.forms import formset_factory


class UserForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())

    class Meta:
        model = User
        fields = ('username', 'email', 'password')


class PublicationForm(forms.Form):
    title = forms.CharField(max_length=255, required=False)
    author = forms.CharField(max_length=255, required=False)
    link = forms.URLField(required=False)

    class Meta:
        fields = ('title', 'author', 'link')


PublicationFormSet = formset_factory(PublicationForm, extra=1)


class AboutForm(forms.Form):
    description = forms.CharField(required=False, widget=forms.TextInput())
    image = forms.ImageField(required=False)

    class Meta:
        fields = ('description', 'image')
